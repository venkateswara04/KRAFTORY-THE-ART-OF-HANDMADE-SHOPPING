import os
from dotenv import load_dotenv

# Load variables from your .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

class Config:
    """Flask configuration class that loads variables from .env"""
    
    SECRET_KEY = os.getenv('SECRET_KEY')
    MONGO_URI = os.getenv('MONGO_URI')
    YOUR_IP = os.getenv('YOUR_IP', '127.0.0.1')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    
    # Optional: For cloud-based file uploads
    CLOUDINARY_URL = os.getenv('CLOUDINARY_URL', None)