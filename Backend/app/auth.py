from flask import Blueprint, request, jsonify
from .models import User
from flask_jwt_extended import create_access_token
import bcrypt

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.objects(email=data['email']).first():
        return jsonify({'msg': 'Email already exists'}), 409
    
    hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    user = User(
        email=data['email'],
        name=data['name'],
        password_hash=hashed_pw.decode('utf-8'),
        role=data['role']
    ).save()
    return jsonify({'msg': 'User created successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.objects(email=data['email']).first()
    
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user.password_hash.encode('utf-8')):
        access_token = create_access_token(identity=str(user.id))
        user_data = {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
        return jsonify(access_token=access_token, user=user_data)
    
    return jsonify({'msg': 'Invalid credentials'}), 401