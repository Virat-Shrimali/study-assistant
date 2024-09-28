import axios from 'axios';

const handleFileUpload = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  axios.post('API_ENDPOINT', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${YOUR_API_KEY}`
    }
  })
  .then(response => {
    const questions = response.data.questions;  // Check what format the API responds with
    setQuestions(questions);  // Assuming you're storing the questions in state
  })
  .catch(error => {
    console.error("Error generating questions:", error);
    alert("Failed to generate questions. Please try again.");
  });
};
