import React, { useState } from "react";
import axios from "axios";
import QuizModal from "./QuizModal";
import "./QuizPage.css";
import * as pdfjsLib from 'pdfjs-dist/webpack';

const API_URL = "http://localhost:5000/generate-questions"; // Change to your Flask API URL

function QuizPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [questions, setQuestions] = useState([]); // Ensure questions is initialized as an empty array
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const extractTextFromPDF = async (pdfFile) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(pdfFile);
    
    return new Promise((resolve, reject) => {
      reader.onload = function () {
        const typedArray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
          let maxPages = pdf.numPages;
          let countPromises = [];
          for (let j = 1; j <= maxPages; j++) {
            let page = pdf.getPage(j);
            countPromises.push(page.then(page => {
              return page.getTextContent().then(textContent => {
                return textContent.items.map(item => item.str).join(" ");
              });
            }));
          }
          Promise.all(countPromises).then(texts => {
            resolve(texts.join(" "));
          }).catch(reject);
        }).catch(reject);
      };
    });
  };

  const generateQuestions = async (text) => {
    try {
      const response = await axios.post(API_URL, { text });
      console.log('API Response:', response.data);
      // Ensure we set questions only if response.data.questions is defined and is an array
      return Array.isArray(response.data.questions) ? response.data.questions : [];
    } catch (error) {
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error config:', error.config);
      throw error; // Re-throw error for handling in calling function
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    try {
      const text = await extractTextFromPDF(selectedFile);
      const generatedQuestions = await generateQuestions(text);
      console.log("Generated Questions:", generatedQuestions); // Log generated questions
      setQuestions(generatedQuestions); // Set questions to the generated array
      setCurrentQuestionIndex(0); // Reset the question index
      setModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error during file upload or question generation:", error);
    }
  };

  const closeModal = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setModalOpen(false);
      setCurrentQuestionIndex(0);
      setQuestions([]); // Clear questions after modal is closed
    }
  };

  // Ensure questions are defined before rendering QuizModal
  const questionData = questions[currentQuestionIndex] || null;

  return (
    <div className="quiz-page-container">
      <h1 className="futuristic-heading">Quiz Page</h1>
      <p className="futuristic-subtext">Upload a PDF to generate quiz questions.</p>

      <div className="file-upload-container">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button className="upload-button" onClick={handleFileUpload}>
          Upload and Generate Quiz
        </button>
      </div>

      {/* Check if questionData is available before passing to QuizModal */}
      <QuizModal
        isOpen={isModalOpen}
        questionData={questionData} // Ensure we access questionData only if questions exist
        onClose={closeModal}
      />
    </div>
  );
}

export default QuizPage;
