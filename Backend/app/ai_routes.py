import os
from flask import Blueprint, request, jsonify, current_app
import google.generativeai as genai
from .config import Config

bp = Blueprint('ai', __name__)

# Configure the AI model
genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

@bp.route('/assist', methods=['POST'])
def ask_assistant():
    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({"error": "No question provided"}), 400

    user_question = data['question']

    # --- This is the "Prompt Engineering" ---
    # We give the AI a personality and rules
    prompt = f"""
    You are "KraftoryAI," a helpful expert on Indian handicrafts and heritage for the e-commerce site Kraftory.
    Your goal is to answer user questions about products, their history, how they are made, and their uses.
    Be warm, respectful, and informative. Never mention you are an AI.
    Only answer questions related to handicrafts, art, history, and corporate gifting. 
    If asked about anything else, politely steer the conversation back to handicrafts.

    User's question: "{user_question}"
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({"answer": response.text})
    except Exception as e:
        current_app.logger.error(f"AI generation failed: {e}")
        return jsonify({"error": "Sorry, I'm having trouble thinking right now."}), 500