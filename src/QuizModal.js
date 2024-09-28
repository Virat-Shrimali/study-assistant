import React from 'react';

function QuizModal({ isOpen, questionData, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="quiz-modal-overlay">
      <div className="quiz-modal">
        <h2>Quiz Question</h2>

        {questionData ? (
          <div className="question-container">
            <p>{questionData.question}</p>
            {questionData.options && questionData.options.length > 0 ? (
              <ul>
                {questionData.options.map((option, index) => (
                  <li key={index}>
                    {String.fromCharCode(65 + index)}) {option}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No options available.</p>
            )}
          </div>
        ) : (
          <p>Loading question...</p>
        )}

        <button className="close-button" onClick={onClose}>Next</button>
      </div>
    </div>
  );
}

export default QuizModal;
