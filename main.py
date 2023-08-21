import json
import openai
import time
import os
from dotenv import load_dotenv


load_dotenv()

api_key = os.environ.get("OPENAI_API_KEY")
openai.api_key = api_key
with open('recipes_raw_nosource_fn.json', 'r') as json_file:
    recipes_data = json.load(json_file)



recipe_training_data = []

# Iterate through each recipe
for recipe_id, recipe in recipes_data.items():
     # Check if the "ingredients" key exists in the recipe entry
     if "ingredients" in recipe:
         ingredients = ', '.join(recipe["ingredients"])  
         instructions = recipe["instructions"]

        
         entry = {
             "prompt": f"What can I make with {ingredients} ->",
             "completion": f"To make a dish with {ingredients}, {instructions}\n"
         }

         recipe_training_data.append(entry)
     else:
         print(f"Skipping recipe with ID {recipe_id} due to missing 'ingredients' key.")

# Export the data to a JSONL file
file_name = "training_data.jsonl"

with open(file_name, "w") as output_file:
  for entry in recipe_training_data:
   json.dump(entry, output_file)
   output_file.write("\n")

upload_response = openai.File.create(
  file=open(file_name, "rb"),
  purpose='fine-tune'
)

file_id = upload_response.id
print(file_id)


fine_tune_response = openai.FineTune.create(training_file=file_id, model="davinci")
print(fine_tune_response)


print(fine_tune_response.id)

while fine_tune_response.fine_tuned_model is None:
    print("Waiting for fine-tuned model to become available...")
    time.sleep(60)  # Wait for 60 seconds before checking again
    fine_tune_response = openai.FineTune.retrieve(id=fine_tune_response.id)
    print(fine_tune_response.status)


if fine_tune_response.fine_tuned_model != None:

    fine_tuned_model = fine_tune_response.fine_tuned_model
    print(fine_tuned_model)
if fine_tune_response.fine_tuned_model == None:
    fine_tune_list = openai.FineTune.list()
    print(fine_tune_list)
    fine_tuned_model = fine_tune_list['data'][0].fine_tuned_model
    print(fine_tuned_model)



new_prompt = "What can I make with 1/2 boiled eggs, some rice, chocolate syrup, oil and bread ->"
answer = openai.Completion.create(
  model=fine_tuned_model,
  prompt=new_prompt,
  max_tokens=100,
  temperature=0
)
print(new_prompt)
print(answer['choices'][0]['text'])

