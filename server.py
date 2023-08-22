
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS class
import json
import openai
import time

app = Flask(__name__)
CORS(app)  # Initialize the CORS extension

api_key = "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"
openai.api_key = api_key
fine_tuned_model="davinci:ft-personal-2023-08-21-14-07-13"

@app.route('/', methods=['GET'])
def check_server():
    return "Server is live!"

@app.route('/submit', methods=['POST'])
def submit_ingredients():
    print("Received ingredients: %s", request)
    try:
        data = request.json
        filled_ingredients = data.get('ingredients')
        ingredient_list = list(set(filled_ingredients))

        # Join the ingredients with commas
        formatted_ingredients = ', '.join(ingredient_list)

# Create the new_prompt string
        new_prompt = f"What can I make with {formatted_ingredients} ->"
        #new_prompt = "What can I make with 1/2 kg chicken, oil, bread, water, butter, cheese ->"
        answer = openai.Completion.create(
        model=fine_tuned_model,
        prompt=new_prompt,
        max_tokens=100,
        temperature=0
        )
        
        
        print(answer['choices'][0]['text'])
        
        return jsonify(answer['choices'][0]['text']), 200
    except Exception as e:
        # Log the error
        print("Error: %s", e)
        return jsonify({"error": "An error occurred"}), 500

if __name__ == '__main__':
    # Configure logging
  
    
    app.run(debug=True)
