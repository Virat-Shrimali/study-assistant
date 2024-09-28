const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // Use environment variable or default to 5000

app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate-plan', async (req, res) => {
  try {
    const { time, subjects } = req.body;

    // Replace with your actual OpenAI API endpoint and parameters
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: "text-davinci-003",
        prompt: `Generate a study plan for the following subjects: ${subjects} with a total study time of ${time} hours.`,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ plan: response.data.choices[0].text });
  } catch (error) {
    console.error('Error during API request:', error.response ? error.response.data : error.message);
    res.status(500).send('Error generating study plan');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
