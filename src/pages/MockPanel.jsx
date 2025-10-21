import React, { useState, useEffect } from "react";
import CameraFeed from "../components/MockPanel/CameraFeed";
import VoiceToTextBox from "../components/MockPanel/VoiceToText";
import QuestionBox from "../components/MockPanel/QuestionBox";
import TextResponseBox from "../components/MockPanel/TextResponse";
import SubmissionSummary from "../components/MockPanel/SubmissionSummary";

// Sample questions with response types
const sampleQuestions = [
  {
    id: 1,
    text: "Tell me about yourself.",
    responseType: "voice",
    timeLimit: 120 // seconds
  },
  {
    id: 2,
    text: "Why do you want this role?",
    responseType: "voice",
    timeLimit: 90
  },
  {
    id: 3,
    text: "What are your strengths?",
    responseType: "voice",
    timeLimit: 60
  },
  {
    id: 4,
    text: "Write a function to reverse a string in JavaScript.",
    responseType: "text",
    timeLimit: 180
  },
  {
    id: 5,
    text: "Explain how you would optimize a slow database query.",
    responseType: "text",
    timeLimit: 150
  }
];

const MockPanel = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showTimeUpMessage, setShowTimeUpMessage] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  // Handle fullscreen mode
  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  // Prevent exiting fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.msFullscreenElement) {
        enterFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    // Prevent closing tab
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your progress may be lost.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    if (timeLeft === 0 && !showTimeUpMessage) {
      setShowTimeUpMessage(true);
      const currentResponse = responses.find(r => r.questionId === currentQuestion.id);
      
      if (!currentResponse) {
        handleResponse('');
      }
      
      const timeout = setTimeout(() => {
        setShowTimeUpMessage(false);
        if (currentQuestionIndex < sampleQuestions.length - 1) {
          handleNext();
        } else {
          handleSubmit();
        }
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, showTimeUpMessage]);

  const handleResponse = (response) => {
    // Check if response already exists for this question
    const existingResponseIndex = responses.findIndex(r => r.questionId === currentQuestion.id);
    
    if (existingResponseIndex >= 0) {
      // Update existing response
      setResponses(prev => {
        const updated = [...prev];
        updated[existingResponseIndex] = {
          ...updated[existingResponseIndex],
          response,
          timestamp: new Date().toISOString()
        };
        return updated;
      });
    } else {
      // Add new response
      setResponses(prev => [
        ...prev,
        {
          questionId: currentQuestion.id,
          question: currentQuestion.text,
          response,
          responseType: currentQuestion.responseType,
          timestamp: new Date().toISOString(),
          timeSpent: currentQuestion.timeLimit - timeLeft
        }
      ]);
    }
  };

  const handleNext = () => {
    // Stop any running timer
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      startTimer(sampleQuestions[currentQuestionIndex + 1].timeLimit);
    }
  };

  const startTimer = (seconds) => {
    setTimeLeft(seconds);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(interval);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (timer) {
      clearInterval(timer);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setIsSubmitted(false);
    setShowTimeUpMessage(false);
    startTimer(sampleQuestions[0].timeLimit);
  };

  // Start timer on first render and enter fullscreen
  useEffect(() => {
    enterFullscreen();
    startTimer(currentQuestion.timeLimit);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  if (isSubmitted) {
    return <SubmissionSummary responses={responses} onRestart={handleRestart} />;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {showTimeUpMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Time's Up!</h2>
            <p className="mb-6">Your response has been auto-saved. The next question will start shortly.</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Camera and Timer */}
        <div className="w-full md:w-1/3 space-y-6">
          <CameraFeed />
          
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Time Remaining</h3>
            <div className="text-3xl font-mono text-center py-2">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${timeLeft < 10 ? 'bg-red-600' : 'bg-blue-600'}`} 
                style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Question Progress</h3>
            <div className="space-y-2">
              {sampleQuestions.map((q, idx) => (
                <div 
                  key={q.id} 
                  className={`p-2 rounded ${idx === currentQuestionIndex ? 'bg-blue-100 border-l-4 border-blue-500' : ''} ${idx < currentQuestionIndex ? 'bg-green-50' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${idx < currentQuestionIndex ? 'bg-green-500 text-white' : idx === currentQuestionIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                      {idx < currentQuestionIndex ? '✓' : idx + 1}
                    </div>
                    <span className={`${idx === currentQuestionIndex ? 'font-medium' : ''}`}>
                      {q.text.substring(0, 30)}{q.text.length > 30 ? '...' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right column - Questions and Responses */}
        <div className="w-full md:w-2/3 space-y-6">
          <QuestionBox 
            question={currentQuestion.text} 
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={sampleQuestions.length}
            onNext={handleNext}
            showNext={currentQuestionIndex < sampleQuestions.length - 1}
            onSubmit={handleSubmit}
          />
          
          {currentQuestion.responseType === 'voice' ? (
            <VoiceToTextBox 
              onResponse={handleResponse} 
              questionId={currentQuestion.id}
              key={currentQuestion.id} // Force re-render for new question
              timeLeft={timeLeft}
            />
          ) : (
            <TextResponseBox 
              onResponse={handleResponse} 
              questionId={currentQuestion.id}
              key={currentQuestion.id}
              timeLeft={timeLeft}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MockPanel;