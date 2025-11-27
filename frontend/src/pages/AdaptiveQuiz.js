import { React, html } from "/src/utils/htm.js";
import { useState } from "react";
import api from "/src/utils/api.js";
import { motion } from "https://esm.sh/framer-motion@10.16.4?external=react,react-dom";

export default function AdaptiveQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  async function startQuiz() {
    setLoading(true);
    try {
      const res = await api.get("/api/quiz/start?count=10");
      setQuestions(res.questions);
      setCurrentIndex(0);
      setScore(0);
      setStarted(true);
      setFinished(false);
      setRewards(null);
    } catch (error) {
      console.error("Failed to load questions:", error);
      alert("Failed to load quiz questions");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(selectedIndex) {
    if (showExplanation) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedIndex === (currentQ.debug_correct.charCodeAt(0) - 65); // A=0, B=1, C=2, D=3

    setSelectedAnswer(selectedIndex);
    setShowExplanation(true);

    if (isCorrect) {
      setScore(score + 10);
    }
  }

  function nextQuestion() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  }

  async function finishQuiz() {
    setFinished(true);

    if (token && userId) {
      const maxScore = questions.length * 10;
      const percentage = Math.round((score / maxScore) * 100);

      try {
        const data = await api.post("/api/quiz/result", { score_percentage: percentage });
        setRewards(data);
      } catch (err) {
        console.error("Failed to submit results", err);
      }
    }
  }

  const currentQuestion = questions[currentIndex];
  const correctIndex = currentQuestion ? (currentQuestion.debug_correct.charCodeAt(0) - 65) : -1;

  return html`
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-warmRed">F1 Quiz</h2>
      </div>
      
      ${!started && html`
        <div className="bg-[#1f1f27] p-8 rounded-lg border border-gray-800">
          <h3 className="text-2xl font-bold mb-4">🏎️ Test Your F1 Knowledge</h3>
          <p className="text-gray-300 mb-6">
            Answer 10 questions about Formula 1 and earn points and coins!
          </p>
          
          <button 
            onClick=${startQuiz} 
            disabled=${loading}
            className="w-full bg-[#FF1E00] hover:bg-red-600 text-white font-bold py-4 px-6 rounded transition-colors text-lg shadow-lg shadow-red-900/20 disabled:opacity-50"
          >
            ${loading ? "Loading..." : "START QUIZ 🚀"}
          </button>
        </div>
      `}
      
      ${started && !finished && currentQuestion && html`
        <div className="space-y-6">
          <div className="bg-[#1f1f27] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Question</div>
              <div className="text-2xl font-bold text-warmRed">${currentIndex + 1} / ${questions.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-2xl font-bold">${score}</div>
            </div>
          </div>
          
          <${motion.div}
            key=${currentIndex}
            initial=${{ opacity: 0, y: 20 }}
            animate=${{ opacity: 1, y: 0 }}
            className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800 shadow-xl"
          >
            <div className="mb-6 text-xl font-medium">${currentQuestion.text}</div>
            
            <div className="grid grid-cols-1 gap-3">
              ${["A", "B", "C", "D"].map((letter, index) => {
    let buttonClass = "p-4 bg-[#262633] rounded border transition-all text-left";

    if (showExplanation) {
      if (index === correctIndex) {
        buttonClass += " border-green-500 bg-green-900/20";
      } else if (selectedAnswer === index && index !== correctIndex) {
        buttonClass += " border-red-500 bg-red-900/20";
      } else {
        buttonClass += " border-gray-700 opacity-50";
      }
    } else {
      buttonClass += " hover:bg-[#2b2b39] hover:border-warmRed border-transparent cursor-pointer";
    }

    const correctIcon = showExplanation && index === correctIndex ? html`<span className="ml-2 text-green-400">✓</span>` : null;

    return html`
                  <button 
                    key=${index}
                    onClick=${() => handleAnswer(index)}
                    disabled=${showExplanation}
                    className=${buttonClass}
                  >
                    <span className="font-bold text-warmRed mr-2">${letter}.</span>
                    ${currentQuestion[letter]}
                    ${correctIcon}
                  </button>
                `;
  })}
            </div>
            
            ${showExplanation && html`
              <${motion.div}
                initial=${{ opacity: 0, height: 0 }}
                animate=${{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 bg-[#262633] rounded border border-gray-700"
              >
                <div className="mb-4 text-sm">
                  ${selectedAnswer === correctIndex
          ? html`<span className="text-green-400 text-lg">✓ Correct! +10 points</span>`
          : html`<span className="text-red-400 text-lg">✗ Incorrect</span>`
        }
                </div>
                
                <button
                  onClick=${nextQuestion}
                  className="w-full bg-warmRed hover:bg-red-600 text-white font-bold py-3 px-6 rounded transition-colors"
                >
                  ${currentIndex + 1 < questions.length ? "Next Question →" : "Finish Quiz"}
                </button>
              </${motion.div}>
            `}
          </${motion.div}>
        </div>
      `}
      
      ${finished && html`
        <${motion.div} 
          initial=${{ scale: 0.9, opacity: 0 }}
          animate=${{ scale: 1, opacity: 1 }}
          className="mt-8 p-8 bg-[#1f1f27] rounded-lg text-center border border-warmRed"
        >
          <h3 className="text-2xl font-bold mb-2">Quiz Complete! 🏁</h3>
          <div className="text-4xl font-bold text-warmRed mb-4">${score} / ${questions.length * 10}</div>
          
          ${rewards && html`
            <div className="mb-6 p-4 bg-[#2A2A3C] rounded-lg border border-yellow-500/30">
              <div className="text-lg text-gray-300 mb-3">Rewards Earned</div>
              <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-1">⭐</span>
                  <span className="font-bold text-yellow-400 text-xl">+${rewards.points_awarded}</span>
                  <span className="text-xs text-gray-500">Points</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-1">🪙</span>
                  <span className="font-bold text-yellow-600 text-xl">+${rewards.coins_awarded}</span>
                  <span className="text-xs text-gray-500">Coins</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
                Total: ${rewards.total_points} ⭐ | ${rewards.total_coins} 🪙
              </div>
            </div>
          `}
          
          ${!token && html`
            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded text-sm">
              <a href="/login" className="text-yellow-400 hover:underline">Login</a> to save your progress and earn rewards!
            </div>
          `}
          
          <button onClick=${() => { setStarted(false); setFinished(false); setRewards(null); }} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded">
            Play Again
          </button>
        </${motion.div}>
      `}
    </div>
  `;
}
