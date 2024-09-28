from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch

# Load the T5 model and tokenizer
model_name = 't5-small'  # You can use 't5-base' for better results
model = T5ForConditionalGeneration.from_pretrained(model_name)
tokenizer = T5Tokenizer.from_pretrained(model_name)

def generate_questions(text):
    # Preprocess the input text
    input_text = f"generate questions: {text}"
    
    # Tokenize the input
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True)

    # Generate the questions using the model
    outputs = model.generate(
        inputs["input_ids"], 
        max_length=150, 
        num_beams=4, 
        early_stopping=True
    )

    # Decode the output
    questions = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return questions

# Sample usage
text = "Your input text for generating quiz questions goes here"
questions = generate_questions(text)
print(questions)
