import os
import uuid
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from mongoengine.errors import NotUniqueError
from bson import ObjectId

# Use relative imports
from .models import Product, Artisan, User
from .utils import upload_image, upload_video

bp = Blueprint('api', __name__)

# --- Public Endpoints ---

@bp.route('/products', methods=['GET'])
def list_products():
    """Gets a list of all active products."""
    try:
        products_query = Product.objects(active=True)
        products = list(products_query)
        output = [product_to_dict(p) for p in products]
        return jsonify({'items': output})
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {e}"}), 500


@bp.route('/products/<slug>', methods=['GET'])
def get_product(slug):
    """Gets a single product by its unique slug."""
    product = Product.objects(slug=slug, active=True).first()
    if not product:
        return jsonify({'msg': 'Product not found'}), 404
    return jsonify(product_to_dict(product))

# --- Seller-Only Endpoint ---

@bp.route('/products', methods=['POST'])
@jwt_required() 
def create_product():
    """Creates a new product, including image, video, and artisan details."""
    current_user_id = get_jwt_identity()
    user = User.objects(id=current_user_id).first()
    if not user or user.role != 'seller':
        return jsonify({"msg": "Access forbidden: Sellers only!"}), 403

    if 'image' not in request.files:
        return jsonify({"msg": "Image file is required"}), 400
    
    form_data = request.form
    required_fields = ['title', 'description', 'price', 'artisan_name']
    if not all(field in form_data for field in required_fields):
        return jsonify({"msg": "Missing required form fields"}), 400

    try:
        image_file = request.files['image']
        image_url = upload_image(image_file, filename=image_file.filename)
    except Exception as e:
        return jsonify({"msg": f"Image upload failed: {e}"}), 500
    
    video_url = None
    if 'heritage_video' in request.files:
        video_file = request.files['heritage_video']
        if video_file.filename != '':
            try:
                video_url = upload_video(video_file, filename=video_file.filename)
            except Exception as e:
                current_app.logger.error(f"Video upload failed: {e}")

    try:
        new_product = Product(
            title=form_data['title'],
            slug=f"{form_data['title'].lower().replace(' ', '-')}-{str(uuid.uuid4())[:4]}",
            description=form_data['description'],
            price=float(form_data['price']),
            images=[image_url],
            heritage_video_url=video_url,
            artisan=Artisan(
                name=form_data['artisan_name'],
                slug=form_data['artisan_name'].lower().replace(' ', '-'),
                contactNumber=form_data.get('artisan_contact'),
                address=form_data.get('artisan_address')
            )
        )
        new_product.save()
        return jsonify({"msg": "Product created successfully"}), 201
    except NotUniqueError:
        return jsonify({"msg": "A product with this title already exists"}), 409
    except Exception as e:
        return jsonify({"msg": f"Could not save product: {e}"}), 500

# --- Cart Management Endpoints ---

@bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()
    if not user: return jsonify({"msg": "User not found"}), 404
    
    detailed_cart = []
    if user.cart:
        for item in user.cart:
            try:
                product = Product.objects(id=ObjectId(item['product_id']), active=True).first()
                if product:
                    detailed_cart.append({
                        "product": product_to_dict(product),
                        "quantity": item['quantity']
                    })
                else:
                    current_app.logger.warning(f"Cart item {item['product_id']} not found.")
            except Exception as e:
                 current_app.logger.error(f"Error processing cart item {item['product_id']}: {e}")
                 pass
                 
    return jsonify(detailed_cart)

@bp.route('/cart/add', methods=['POST'])
@jwt_required()
def add_to_cart_db():
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()
    if not user: return jsonify({"msg": "User not found"}), 404
        
    data = request.get_json()
    product_id = data.get('product_id')
    if not product_id: return jsonify({"msg": "Product ID is required"}), 400

    try:
        if not Product.objects(id=ObjectId(product_id), active=True).first():
             return jsonify({"msg": "Product not found"}), 404
    except Exception:
         return jsonify({"msg": "Invalid Product ID"}), 400
        
    cart_item = next((item for item in user.cart if item['product_id'] == product_id), None)
    
    if cart_item:
        cart_item['quantity'] += 1
    else:
        user.cart.append({'product_id': product_id, 'quantity': 1})
        
    user.save()
    return jsonify({"msg": "Item added to cart"})

@bp.route('/cart/remove/<product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart_db(product_id):
    user_id = get_jwt_identity()
    user = User.objects(id=user_id).first()
    if not user: return jsonify({"msg": "User not found"}), 404
        
    initial_length = len(user.cart)
    user.cart = [item for item in user.cart if item['product_id'] != product_id]
    
    if len(user.cart) < initial_length:
        user.save()
        return jsonify({"msg": "Item removed from cart"})
    else:
        return jsonify({"msg": "Item not found in cart"}), 404

# --- Helper Function ---

def product_to_dict(p):
    if not p: return None
    m = p.to_mongo().to_dict()

    m['id'] = str(m['_id'])
    del m['_id']
        
    if 'artisan' in m and m.get('artisan'):
        m['artisan'] = {k: v for k, v in m['artisan'].items()}
        
    return m

@bp.route('/artisans', methods=['GET'])
def list_artisans():
    """
    Gets a list of all unique artisans (name and slug) from the products.
    """
    try:
        # This is an aggregation pipeline. It's the fastest way to get
        # a list of unique artisans from all products.
        pipeline = [
            {
                # 1. Group by the artisan's slug (which should be unique)
                "$group": {
                    "_id": "$artisan.slug",
                    # 2. Get the first name associated with that slug
                    "name": { "$first": "$artisan.name" }
                }
            },
            {
                # 3. Format the output to be cleaner
                "$project": {
                    "_id": 0,
                    "slug": "$_id",
                    "name": "$name"
                }
            },
            {
                # 4. Sort the list alphabetically by name
                "$sort": { "name": 1 }
            }
        ]
        # Run the pipeline on the Product collection
        artisans = list(Product.objects.aggregate(pipeline))
        return jsonify(artisans)
        
    except Exception as e:
        current_app.logger.error(f"Failed to fetch artisans: {e}")
        return jsonify({"msg": f"An error occurred: {e}"}), 500
    
@bp.route('/artisan/<slug>', methods=['GET'])
def artisan_page(slug):
    # Find at least one product by this artisan to get their details
    product = Product.objects(artisan__slug=slug, active=True).first()
    
    if not product:
        return jsonify({'msg': 'Artisan not found'}), 404

    # Get the artisan's details from that one product
    artisan = product.artisan
    
    # Now, find all products by this artisan
    products_list = Product.objects(artisan__slug=slug, active=True)
    
    # Convert data for JSON
    prod_list_dict = [product_to_dict(p) for p in products_list]
    artisan_dict = {
        'name': artisan.name,
        'slug': artisan.slug,
        'location': artisan.location,
        'bio': artisan.bio,
        'contactNumber': artisan.contactNumber,
        'address': artisan.address
    }
    
    return jsonify({'artisan': artisan_dict, 'products': prod_list_dict})