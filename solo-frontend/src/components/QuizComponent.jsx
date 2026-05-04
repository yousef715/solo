import { useState } from 'react';

function QuizComponent({ quizData, onPass }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  if (!quizData || !Array.isArray(quizData) || quizData.length === 0) {
    return <div className="alert alert-warning">No quiz data available for this module. Make sure to add it in the Strapi Admin Panel.</div>;
  }

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    quizData.forEach((q, index) => {
      // Ensure we compare numbers
      if (Number(selectedAnswers[index]) === Number(q.correctAnswerIndex)) {
        correctCount++;
      }
    });
    const percentage = (correctCount / quizData.length) * 100;
    setScore(percentage);
    setShowResults(true);

    if (percentage >= 80) {
      onPass(); // Trigger the finish lesson logic in CourseDetails
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const passed = score >= 80;
    return (
      <div className="bg-base-100 p-8 rounded-2xl text-center border border-base-300 shadow-sm animate-in zoom-in duration-300">
        <div className={`text-6xl mb-4 ${passed ? 'text-success' : 'text-error'}`}>
          {passed ? '🏆' : '💔'}
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {passed ? 'Congratulations!' : 'Keep Trying!'}
        </h3>
        <p className="text-base-content/70 mb-6">
          You scored <span className={`font-bold ${passed ? 'text-success' : 'text-error'}`}>{score.toFixed(0)}%</span> (Requires 80% to pass)
        </p>
        
        {passed ? (
          <div className="alert alert-success shadow-sm border-none bg-green-100 text-green-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>You've successfully completed this quiz and earned your XP! The next lesson is now unlocked.</span>
          </div>
        ) : (
          <button onClick={handleRetry} className="btn btn-error text-white w-full shadow-lg shadow-error/30">
            Retry Quiz ↻
          </button>
        )}
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const hasSelected = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className="bg-base-100 p-6 md:p-8 rounded-2xl border border-base-300 shadow-sm relative overflow-hidden">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
      
      <div className="flex justify-between items-center mb-6 text-sm font-medium text-base-content/50">
        <span className="badge badge-primary badge-outline font-bold">Question {currentQuestionIndex + 1} of {quizData.length}</span>
        <progress className="progress progress-primary w-24 md:w-48" value={currentQuestionIndex} max={quizData.length}></progress>
      </div>

      <h3 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">{currentQuestion.question}</h3>

      <div className="flex flex-col gap-3 mb-8">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={`btn justify-start text-left normal-case h-auto min-h-[3.5rem] py-3 px-4 md:px-6 transition-all duration-200 ${
              selectedAnswers[currentQuestionIndex] === index
                ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20 hover:border-primary shadow-sm'
                : 'bg-base-100 border-base-300 hover:border-primary/50 hover:bg-base-200 text-base-content shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4 w-full">
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                selectedAnswers[currentQuestionIndex] === index ? 'border-primary bg-primary text-primary-content' : 'border-base-300'
              }`}>
                {selectedAnswers[currentQuestionIndex] === index && <span className="w-2 h-2 rounded-full bg-white"></span>}
              </span>
              <span className="text-sm md:text-base">{option}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!hasSelected}
        className="btn btn-primary w-full shadow-lg shadow-primary/20"
      >
        {currentQuestionIndex < quizData.length - 1 ? 'Next Question →' : 'Submit Answers ✓'}
      </button>
    </div>
  );
}

export default QuizComponent;
