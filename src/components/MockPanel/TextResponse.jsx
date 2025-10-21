import React, { useState, useEffect } from 'react';

const TextResponseBox = ({ onResponse, questionId, timeLeft }) => {
  const [response, setResponse] = useState('');
  const [hasResponded, setHasResponded] = useState(false);

  // Auto-save when time is running low
  useEffect(() => {
    if (timeLeft <= 5 && response.trim() && !hasResponded) {
      onResponse(response);
      setHasResponded(true);
    }
  }, [timeLeft, response, hasResponded, onResponse]);

  const handleChange = (e) => {
    setResponse(e.target.value);
    setHasResponded(false);
  };

  const saveResponse = () => {
    if (response.trim()) {
      onResponse(response);
      setHasResponded(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Written Response</h3>
      
      {timeLeft <= 10 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4">
          <p className="font-medium">⚠️ Only {timeLeft} seconds remaining! Your response will auto-save.</p>
        </div>
      )}
      
      <textarea
        rows="10"
        className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 mb-4 font-mono text-sm"
        value={response}
        onChange={handleChange}
        placeholder="Type your response here..."
      />

      {(hasResponded || (timeLeft <= 5 && response.trim())) ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
          <p className="font-medium">✓ Response saved</p>
        </div>
      ) : (
        <button
          onClick={saveResponse}
          disabled={!response.trim()}
          className={`w-full px-4 py-2 rounded-lg font-medium ${
            response.trim() 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save Response
        </button>
      )}
    </div>
  );
};

export default TextResponseBox;