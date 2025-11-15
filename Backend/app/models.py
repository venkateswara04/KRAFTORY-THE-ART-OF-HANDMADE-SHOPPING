from mongoengine import Document, EmbeddedDocument, StringField, ListField, EmbeddedDocumentField, FloatField, BooleanField, DateTimeField, DictField
import datetime

class Artisan(EmbeddedDocument):
    name = StringField(required=True)
    slug = StringField(required=True)
    location = StringField()
    bio = StringField()
    contactNumber = StringField()
    address = StringField()

class Product(Document):
    title = StringField(required=True, unique=True)
    slug = StringField(required=True, unique=True)
    description = StringField()
    price = FloatField(required=True)
    images = ListField(StringField())
    heritage_video_url = StringField()
    artisan = EmbeddedDocumentField(Artisan)
    active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    meta = {'collection': 'products'}

class User(Document):
    email = StringField(required=True, unique=True)
    name = StringField(required=True)
    password_hash = StringField(required=True)
    role = StringField(required=True, choices=['buyer', 'seller'])
    cart = ListField(DictField()) # Stores [{'product_id': '...', 'quantity': 1}]
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    meta = {'collection': 'users'}