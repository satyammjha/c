import React from "react";

const QuestionBox = ({ question, questionNumber, totalQuestions, onNext, showNext, onSubmit }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {questionNumber <= 3 ? "Behavioral" : "Technical"}
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-6">{question}</h2>
      
      <div className="flex justify-end space-x-3">
        {showNext ? (
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Submit Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionBox;