import os
import uuid
from flask import current_app
from .config import Config
import cloudinary
import cloudinary.uploader
from werkzeug.utils import secure_filename

# Go UP one level from this file (in 'app') to the 'backend' folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Join with 'uploads'
UPLOAD_DIR = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Get the IP address from the Config
YOUR_IP = Config.YOUR_IP

def _save_file(file_storage, filename):
    """
    Internal helper function to securely save a file and return its URL.
    """
    # Sanitize the original filename to remove spaces
    sanitized_filename = secure_filename(filename)
    
    # Create a unique name to prevent file overwrites
    safe_name = f"{uuid.uuid4().hex}_{sanitized_filename}"
    
    # Save the file to the /uploads/ directory
    path = os.path.join(UPLOAD_DIR, safe_name)
    file_storage.save(path)
    
    # Return the full, correct URL
    return f"http://{YOUR_IP}:5000/media/{safe_name}"


def upload_image(file_storage, filename=None):
    """Handles image file uploads."""
    if not filename: 
        filename = file_storage.filename
    return _save_file(file_storage, filename)


def upload_video(file_storage, filename=None):
    """Handles video file uploads."""
    if not filename: 
        filename = file_storage.filename
    return _save_file(file_storage, filename)