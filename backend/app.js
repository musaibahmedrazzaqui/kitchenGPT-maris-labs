const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const OpenAI=require('openai')
//require('dotenv').config()
const app = express();
const port = 8000 || process.env.PORT;

// Middleware to allow CORS
app.use(cors()); // Add this line
// Middleware to parse JSON requests
app.use(bodyParser.json());

const openAiApiKey = process.env.OPENAI_API_KEY; // Replace with your OpenAI API key
//console.log(openAiApiKey)
const fineTunedModelName = 'ft:gpt-3.5-turbo-0613:personal::8F1CtRR8'; // Replace with your fine-tuned model name

const openai = new OpenAI({apiKey:openAiApiKey});
// Endpoint to handle user prompts
app.post('/chatbot-normal', async (req, res) => {
  try {
    const prompt = req.body.message;
    console.log("NORMAL",req.body.message)
    const response = await callOpenAiApi(prompt);

    res.json({ response: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to handle dropout prompts
app.post('/chatbot-dropout', async (req, res) => {
  try {
    const prompt = req.body.message;
    console.log("DROPOUT",req.body.message)
    const response = await callOpenAiApi(prompt, true);

    res.json({ response: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to call OpenAI API
const callOpenAiApi = async (prompt, useDropout = false) => {
  const model = useDropout ? `ft:gpt-3.5-turbo-0613:personal::8F26sjza` : fineTunedModelName;
  console.log("prompt",prompt)
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'system', content: 'You are a helpful pharmaceutical drug assistant. User will ask you about a drug name and tell you their age group. You will tell them other users of the same age group experience with that drug.' }, { role: 'user', content: prompt }],
  });

  console.log(response.choices[0].message.content);

  return response;
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
