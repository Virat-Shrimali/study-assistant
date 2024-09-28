from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import T5ForConditionalGeneration, T5Tokenizer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the T5 model and tokenizer
model_name = "t5-small"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    data = request.json
    text = data.get("text")

    # Prepare input for T5 with detailed prompt
    prompt = f"Generate a quiz question with four options labeled A, B, C, and D based on the following text: {text}"
    input_ids = tokenizer.encode(prompt, return_tensors="pt")

    # Generate questions
    outputs = model.generate(input_ids, max_length=150, num_beams=4, early_stopping=True)
    questions_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Split the generated text into question and options
    question_parts = questions_text.split('\n')
    question = question_parts[0]  # Assuming the first line is the question
    options = question_parts[1:]   # The rest are options

    # Ensure we have exactly four options
    options = options[:4]  # Trim to the first four options

    # Create a structured response
    response = {
        "question": question,
        "options": options
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
