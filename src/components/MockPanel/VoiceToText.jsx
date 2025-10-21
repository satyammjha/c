import React, { useState, useEffect, useRef } from 'react';

const VoiceToTextBox = ({ onResponse, questionId, timeLeft }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);
  const [hasResponded, setHasResponded] = useState(false);

  const browserSupportsRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (timeLeft <= 5 && transcript.trim() && !hasResponded) {
      onResponse(transcript);
      setHasResponded(true);
    }
  }, [timeLeft, transcript, hasResponded, onResponse]);

  useEffect(() => {
    if (!browserSupportsRecognition) {
      setError('Your browser does not support speech recognition.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript + ' ');
        setHasResponded(false);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setError(getErrorMessage(event.error));
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [browserSupportsRecognition, questionId]);

  const getErrorMessage = (errorCode) => {
    switch(errorCode) {
      case 'not-allowed': return 'Microphone access denied. Please allow permissions.';
      case 'no-speech': return 'No speech detected. Try speaking louder.';
      case 'network': return 'Network error. Check your connection.';
      case 'audio-capture': return 'Microphone not found. Check your device.';
      default: return `Error: ${errorCode}. Try refreshing.`;
    }
  };

  const startListening = async () => {
    if (!recognitionRef.current) return;

    try {
      if (isListening) {
        recognitionRef.current.stop();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setError('');
      setInterimTranscript('');
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (err) {
          setError('Failed to start. Please try again.');
          setIsListening(false);
        }
      }, 100);
    } catch (err) {
      setError('Microphone access denied. Please allow permissions.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const saveResponse = () => {
    if (transcript.trim()) {
      onResponse(transcript);
      setHasResponded(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Voice Response</h3>
      
      {timeLeft <= 10 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4">
          <p className="font-medium">⚠️ Only {timeLeft} seconds remaining! Your response will auto-save.</p>
        </div>
      )}

      <div className="flex items-center justify-center mb-4">
        <div className={`w-4 h-4 rounded-full mr-3 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        <p className="font-medium">
          {isListening ? "Listening... Speak now" : "Ready to record"}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">⚠️ {error}</p>
        </div>
      )}

      <div className="flex space-x-3 mb-4">
        <button
          onClick={startListening}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          disabled={isListening}
        >
          Start Recording
        </button>
        <button
          onClick={stopListening}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          disabled={!isListening}
        >
          Stop Recording
        </button>
      </div>

      <textarea
        rows="6"
        className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 mb-4"
        value={transcript + interimTranscript}
        placeholder="Your recorded response will appear here..."
        readOnly
      />

      {(hasResponded || (timeLeft <= 5 && transcript.trim())) ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
          <p className="font-medium">✓ Response saved</p>
        </div>
      ) : (
        <button
          onClick={saveResponse}
          disabled={!transcript.trim()}
          className={`w-full px-4 py-2 rounded-lg font-medium ${
            transcript.trim() 
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

export default VoiceToTextBox;