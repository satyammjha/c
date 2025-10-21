const SubmissionSummary = ({ responses, onRestart }) => {
  const totalQuestions = responses.length;
  const attempted = responses.filter(r => r.response && r.response.trim()).length;
  
  // Calculate average time per question (only for attempted questions)
  const totalTimeSpent = responses
    .filter(r => r.response && r.response.trim())
    .reduce((sum, r) => sum + (r.timeSpent || 0), 0);
  
  const avgTime = attempted > 0 ? totalTimeSpent / attempted : 0;
  
  // Calculate time distribution
  const timeDistribution = responses.map(r => ({
    question: `Q${responses.findIndex(res => res.questionId === r.questionId) + 1}`,
    timeSpent: r.timeSpent || 0
  }));

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Interview Summary</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h3 className="font-bold text-gray-700">Questions Attempted</h3>
          <p className="text-3xl font-bold text-blue-600">
            {attempted}<span className="text-lg text-gray-500">/{totalQuestions}</span>
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h3 className="font-bold text-gray-700">Avg Time/Question</h3>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(avgTime)}<span className="text-lg text-gray-500">s</span>
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <h3 className="font-bold text-gray-700">Completion</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {Math.round((attempted/totalQuestions)*100)}<span className="text-lg text-gray-500">%</span>
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold mb-4">Time Distribution</h3>
        <div className="flex items-end h-40 gap-1 border-b-2 border-gray-200">
          {timeDistribution.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 hover:bg-blue-600 transition-all"
                style={{ height: `${Math.min(100, (item.timeSpent / 180) * 100)}%` }}
                title={`Q${index+1}: ${item.timeSpent}s`}
              ></div>
              <span className="text-xs mt-1">{item.question}</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="font-bold mb-4">Detailed Responses</h3>
      {responses.map((response, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg hover:bg-gray-50">
          <h3 className="font-bold mb-2 flex justify-between">
            <span>Q{index+1}: {response.question}</span>
            <span className="text-sm font-normal text-gray-500">
              {response.timeSpent || 0}s spent • {response.responseType}
            </span>
          </h3>
          <div className={`p-3 rounded ${response.response ? 'bg-gray-50' : 'bg-red-50'}`}>
            <p className="whitespace-pre-wrap">
              {response.response || "No response provided"}
            </p>
          </div>
        </div>
      ))}

      <button 
        onClick={onRestart}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
      >
        Start New Interview
      </button>
    </div>
  );
};

export default SubmissionSummary;