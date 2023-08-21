import json
import openai
import time
import os
from dotenv import load_dotenv


load_dotenv()

api_key = os.environ.get("OPENAI_API_KEY")
openai.api_key = api_key
fine_tuned_model="davinci:ft-personal-2023-08-21-14-07-13"

#This prompt will be generated when connected with UI
new_prompt = "What can I make with 1/2 kg chicken, oil, bread, water, butter, cheese ->"
answer = openai.Completion.create(
  model=fine_tuned_model,
  prompt=new_prompt,
  max_tokens=100,
  temperature=0
)
print(new_prompt)
print(answer['choices'][0]['text'])

