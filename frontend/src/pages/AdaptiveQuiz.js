import { React, html } from "/src/utils/htm.js";
import { useState, useEffect } from "react";
import api from "/src/utils/api.js";
import { motion } from "https://esm.sh/framer-motion@10.16.4?external=react,react-dom";

// Rank badge component
function RankBadge({ rank }) {
    const rankColors = {
        bronze: "from-amber-700 to-amber-900",
        silver: "from-gray-300 to-gray-500",
        gold: "from-yellow-400 to-yellow-600",
        platinum: "from-cyan-400 to-cyan-600",
        diamond: "from-blue-400 to-purple-600"
    };

    const rankIcons = {
        bronze: "🥉",
        silver: "🥈",
        gold: "🥇",
        platinum: "💎",
        diamond: "👑"
    };

    return html`
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${rankColors[rank]} text-white font-bold text-sm shadow-lg">
      <span>${rankIcons[rank]}</span>
      <span className="uppercase">${rank}</span>
    </div>
  `;
}

// Difficulty indicator component
function DifficultyIndicator({ difficulty }) {
    const colors = {
        easy: "bg-green-500",
        medium: "bg-yellow-500",
        hard: "bg-red-500"
    };

    return html`
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full ${colors[difficulty]}"></div>
      <span className="text-sm text-gray-400 capitalize">${difficulty}</span>
    </div>
  `;
}

export default function AdaptiveQuiz() {
    const [playerState, setPlayerState] = useState({
        score: 0,
        rank: "bronze",
        previous_difficulty: "easy",
        accuracy_last_5: 50,
        category: "F1",
        pace: "normal"
    });

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const [answerHistory, setAnswerHistory] = useState([]);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [lastAnswer, setLastAnswer] = useState(null);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    // Calculate accuracy from last 5 answers
    function calculateAccuracy() {
        if (answerHistory.length === 0) return 50;
        const recent = answerHistory.slice(-5);
        const correct = recent.filter(a => a.correct).length;
        return (correct / recent.length) * 100;
    }

    // Calculate answer pace
    function calculatePace(timeSeconds) {
        if (timeSeconds < 5) return "fast";
        if (timeSeconds > 15) return "slow";
        return "normal";
    }

    // Fetch next adaptive question
    async function fetchNextQuestion() {
        setLoading(true);
        setShowExplanation(false);
        setLastAnswer(null);

        try {
            const response = await api.post("/api/quiz/adaptive", playerState);
            setCurrentQuestion(response);
            setQuestionStartTime(Date.now());
        } catch (error) {
            console.error("Failed to fetch question:", error);
            alert("AI generation failed, using fallback questions");
        } finally {
            setLoading(false);
        }
    }

    // Start the adaptive quiz
    function startQuiz() {
        setStarted(true);
        setPlayerState({
            score: 0,
            rank: "bronze",
            previous_difficulty: "easy",
            accuracy_last_5: 50,
            category: "F1",
            pace: "normal"
        });
        setAnswerHistory([]);
        setQuestionsAnswered(0);
        fetchNextQuestion();
    }

    // Handle answer selection
    function handleAnswer(selectedIndex) {
        if (!currentQuestion || showExplanation) return;

        const answerTime = Math.floor((Date.now() - questionStartTime) / 1000);
        const isCorrect = selectedIndex === currentQuestion.correct_answer_index;

        // Update answer history
        const newAnswer = {
            correct: isCorrect,
            time: answerTime,
            difficulty: currentQuestion.difficulty
        };
        setAnswerHistory([...answerHistory, newAnswer]);
        setLastAnswer({ ...newAnswer, selectedIndex });

        // Update player state
        const newScore = playerState.score + (isCorrect ? 10 : 0);
        const newAccuracy = calculateAccuracy();
        const newPace = calculatePace(answerTime);

        setPlayerState({
            ...playerState,
            score: newScore,
            previous_difficulty: currentQuestion.difficulty,
            accuracy_last_5: newAccuracy,
            pace: newPace
        });

        setQuestionsAnswered(questionsAnswered + 1);
        setShowExplanation(true);

        // Save points if logged in
        if (token && userId && isCorrect) {
            const pointsUrl = "/api/points/" + userId;
            api.post(pointsUrl, { score: 10, mode: "adaptive" }, token);
        }
    }

    // Continue to next question
    function nextQuestion() {
        // Check for rank adjustment
        if (currentQuestion.rank_adjustment === "increase") {
            const ranks = ["bronze", "silver", "gold", "platinum", "diamond"];
            const currentIndex = ranks.indexOf(playerState.rank);
            if (currentIndex < ranks.length - 1) {
                setPlayerState({ ...playerState, rank: ranks[currentIndex + 1] });
            }
        }

        fetchNextQuestion();
    }

    const startedContent = started && html`<${RankBadge} rank=${playerState.rank} />`;

    return html`
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-warmRed">Adaptive AI Quiz</h2>
        ${startedContent}
      </div>
      
      ${!started && html`
        <div className="bg-[#1f1f27] p-8 rounded-lg border border-gray-800">
          <h3 className="text-2xl font-bold mb-4">🤖 AI-Powered Adaptive Challenge</h3>
          <p className="text-gray-300 mb-6">
            Experience an intelligent quiz that adapts to your skill level in real-time. 
            Questions get harder as you improve, and easier if you struggle.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold">Adaptive Difficulty</div>
                <div className="text-sm text-gray-400">Questions adjust based on your performance</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="font-semibold">Rank Progression</div>
                <div className="text-sm text-gray-400">Bronze → Silver → Gold → Platinum → Diamond</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="font-semibold">Performance Tracking</div>
                <div className="text-sm text-gray-400">Monitors accuracy, pace, and difficulty trends</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-lg text-gray-300">Category:</label>
            <select 
              value=${playerState.category} 
              onChange=${e => setPlayerState({ ...playerState, category: e.target.value })}
              className="w-full bg-[#262633] p-3 rounded border border-gray-700 focus:border-warmRed outline-none text-white"
            >
              <option value="F1">Formula 1</option>
              <option value="general">General Knowledge</option>
            </select>
          </div>
          
          <button 
            onClick=${startQuiz} 
            className="w-full bg-[#FF1E00] hover:bg-red-600 text-white font-bold py-4 px-6 rounded transition-colors text-lg shadow-lg shadow-red-900/20"
          >
            START ADAPTIVE CHALLENGE 🚀
          </button>
        </div>
      `}
      
      ${started && !loading && currentQuestion && html`
        <div className="space-y-6">
          <div className="bg-[#1f1f27] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-2xl font-bold text-warmRed">${playerState.score}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Questions</div>
              <div className="text-2xl font-bold">${questionsAnswered}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Accuracy</div>
              <div className="text-2xl font-bold text-green-400">${Math.round(playerState.accuracy_last_5)}%</div>
            </div>
            <${DifficultyIndicator} difficulty=${currentQuestion.difficulty} />
          </div>
          
          <${motion.div}
            key=${questionsAnswered}
            initial=${{ opacity: 0, y: 20 }}
            animate=${{ opacity: 1, y: 0 }}
            className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800 shadow-xl"
          >
            <div className="mb-6 text-xl font-medium">${currentQuestion.question}</div>
            
            <div className="grid grid-cols-1 gap-3">
              ${currentQuestion.options.map((option, index) => {
        let buttonClass = "p-4 bg-[#262633] rounded border transition-all text-left";

        if (showExplanation) {
            if (index === currentQuestion.correct_answer_index) {
                buttonClass += " border-green-500 bg-green-900/20";
            } else if (lastAnswer && index === lastAnswer.selectedIndex && !lastAnswer.correct) {
                buttonClass += " border-red-500 bg-red-900/20";
            } else {
                buttonClass += " border-gray-700 opacity-50";
            }
        } else {
            buttonClass += " hover:bg-[#2b2b39] hover:border-warmRed border-transparent cursor-pointer";
        }

        const correctIcon = showExplanation && index === currentQuestion.correct_answer_index ? html`<span className="ml-2 text-green-400">✓</span>` : null;

        return html`
                  <button 
                    key=${index}
                    onClick=${() => handleAnswer(index)}
                    disabled=${showExplanation}
                    className=${buttonClass}
                  >
                    <span className="font-bold text-warmRed mr-2">${String.fromCharCode(65 + index)}.</span>
                    ${option}
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
                <div className="text-sm text-gray-400 mb-2">Explanation:</div>
                <div className="text-gray-200">${currentQuestion.explanation}</div>
                
                ${lastAnswer && html`
                  <div className="mt-4 text-sm">
                    ${lastAnswer.correct
                        ? html`<span className="text-green-400">✓ Correct! +10 points</span>`
                        : html`<span className="text-red-400">✗ Incorrect</span>`
                    }
                    <span className="text-gray-500 ml-3">Answered in ${lastAnswer.time}s</span>
                  </div>
                `}
                
                <button
                  onClick=${nextQuestion}
                  className="mt-4 w-full bg-warmRed hover:bg-red-600 text-white font-bold py-3 px-6 rounded transition-colors"
                >
                  Next Question →
                </button>
              </${motion.div}>
            `}
          </${motion.div}>
        </div>
      `}
      
      ${loading && html`
        <div className="bg-[#1f1f27] p-12 rounded-lg border border-gray-800 text-center">
          <div className="text-2xl mb-4">🤖</div>
          <div className="text-gray-400">Generating adaptive question...</div>
        </div>
      `}
    </div>
  `;
}
