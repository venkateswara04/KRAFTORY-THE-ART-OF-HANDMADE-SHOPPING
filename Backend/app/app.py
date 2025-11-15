import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from mongoengine import connect

from .config import Config 
from .routes import bp as api_bp
from .auth import bp as auth_bp
from .ai_routes import bp as ai_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    JWTManager(app)
    connect(host=Config.MONGO_URI)
    
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    # Media Serving Route (for files in /backend/uploads/)
    @app.route('/media/<path:filename>')
    def serve_media(filename):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        upload_dir = os.path.join(base_dir, 'uploads')
        return send_from_directory(upload_dir, filename)

    @app.route('/')
    def root():
        return jsonify({'msg': 'handcrafted marketplace backend running'})
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000, host='0.0.0.0')