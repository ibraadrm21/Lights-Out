import { React, html } from "/src/utils/htm.js";
import { useState, useContext } from "react";
import api from "/src/utils/api.js";
import { motion } from "https://esm.sh/framer-motion@10.16.4?external=react,react-dom";
import { UserContext } from "/src/context/UserContext.jsx";

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

  const [seenQuestions, setSeenQuestions] = useState([]);
  const [nextQuestionData, setNextQuestionData] = useState(null);
  const [fetchingNext, setFetchingNext] = useState(false);

  const { token, applyReward, user } = useContext(UserContext);
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

  // Fetch a single question (helper)
  async function fetchQuestionData(currentState, currentSeen) {
    try {
      const response = await api.post("/api/quiz/adaptive", {
        ...currentState,
        seen_questions: currentSeen
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch question:", error);
      return null;
    }
  }

  // Start the adaptive quiz
  async function startQuiz() {
    setStarted(true);
    setLoading(true);

    const initialState = {
      score: 0,
      rank: "bronze",
      previous_difficulty: "easy",
      accuracy_last_5: 50,
      category: playerState.category,
      pace: "normal"
    };

    setPlayerState(initialState);
    setAnswerHistory([]);
    setQuestionsAnswered(0);
    setSeenQuestions([]);

    // Fetch first question
    const firstQ = await fetchQuestionData(initialState, []);

    if (firstQ) {
      setCurrentQuestion(firstQ);
      setQuestionStartTime(Date.now());
      setSeenQuestions([firstQ.question]);

      // Pre-fetch second question immediately
      setFetchingNext(true);
      fetchQuestionData(initialState, [firstQ.question]).then(nextQ => {
        setNextQuestionData(nextQ);
        setFetchingNext(false);
      });
    } else {
      alert("Failed to start quiz. Please try again.");
      setStarted(false);
    }
    setLoading(false);
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
    const newHistory = [...answerHistory, newAnswer];
    setAnswerHistory(newHistory);
    setLastAnswer({ ...newAnswer, selectedIndex });

    // Update player state
    const newScore = playerState.score + (isCorrect ? 10 : 0);

    // Recalculate accuracy based on updated history
    const recent = newHistory.slice(-5);
    const correctCount = recent.filter(a => a.correct).length;
    const newAccuracy = (correctCount / recent.length) * 100;

    const newPace = calculatePace(answerTime);

    const newState = {
      ...playerState,
      score: newScore,
      previous_difficulty: currentQuestion.difficulty,
      accuracy_last_5: newAccuracy,
      pace: newPace
    };

    // Check for rank adjustment
    if (currentQuestion.rank_adjustment === "increase") {
      const ranks = ["bronze", "silver", "gold", "platinum", "diamond"];
      const currentIndex = ranks.indexOf(newState.rank);
      if (currentIndex < ranks.length - 1) {
        newState.rank = ranks[currentIndex + 1];
      }
    }

    setPlayerState(newState);
    setQuestionsAnswered(questionsAnswered + 1);
    setShowExplanation(true);

    // Save points if logged in
    if (token && userId && isCorrect) {
      const pointsUrl = "/api/points/" + userId;
      api.post(pointsUrl, { score: 10, mode: "adaptive" }, token);
    }

    // Pre-fetch NEXT question now (while user is reading explanation)
    if (!nextQuestionData && !fetchingNext) {
      setFetchingNext(true);
      fetchQuestionData(newState, [...seenQuestions, currentQuestion.question]).then(nextQ => {
        setNextQuestionData(nextQ);
        setFetchingNext(false);
      });
    }
  }

  // Continue to next question
  async function nextQuestion() {
    setShowExplanation(false);
    setLastAnswer(null);
    setLoading(true);

    if (nextQuestionData) {
      // Use pre-fetched question
      const nextQ = nextQuestionData;
      setCurrentQuestion(nextQ);
      setQuestionStartTime(Date.now());
      setSeenQuestions(prev => [...prev, nextQ.question]);
      setNextQuestionData(null);
      setLoading(false);

      // Pre-fetch the one after that
      setFetchingNext(true);
      const updatedSeen = [...seenQuestions, nextQ.question];
      fetchQuestionData(playerState, updatedSeen).then(q => {
        setNextQuestionData(q);
        setFetchingNext(false);
      });

    } else {
      // Fallback if pre-fetch failed or wasn't ready
      const nextQ = await fetchQuestionData(playerState, seenQuestions);
      if (nextQ) {
        setCurrentQuestion(nextQ);
        setQuestionStartTime(Date.now());
        setSeenQuestions(prev => [...prev, nextQ.question]);

        // Start pre-fetch for next
        setFetchingNext(true);
        fetchQuestionData(playerState, [...seenQuestions, nextQ.question]).then(q => {
          setNextQuestionData(q);
          setFetchingNext(false);
        });
      } else {
        alert("Failed to generate question. Please try again.");
      }
      setLoading(false);
    }
  }

  return html`
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-warmRed">AI Adaptive Quiz</h2>
        ${started && html`<${RankBadge} rank=${playerState.rank} />`}
      </div>
      
      ${!started && html`
        <div className="bg-[#1f1f27] p-8 rounded-lg border border-gray-800">
          <h3 className="text-2xl font-bold mb-4">🤖 AI-Powered Adaptive Quiz</h3>
          <p className="text-gray-300 mb-6">
            Experience an intelligent quiz that adapts to your skill level. Questions get harder as you improve!
          </p>
          
          <button 
            onClick=${startQuiz} 
            disabled=${loading}
            className="w-full bg-[#FF1E00] hover:bg-red-600 text-white font-bold py-4 px-6 rounded transition-colors text-lg shadow-lg shadow-red-900/20 disabled:opacity-50"
          >
            ${loading ? "Loading..." : "START AI QUIZ 🚀"}
          </button>
        </div>
      `}
      
      ${started && currentQuestion && html`
        <div className="space-y-6">
          <div className="bg-[#1f1f27] p-4 rounded-lg border border-gray-800 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Questions Answered</div>
              <div className="text-2xl font-bold text-warmRed">${questionsAnswered}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-2xl font-bold">${playerState.score}</div>
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
                  disabled=${loading}
                  className="w-full mt-4 bg-warmRed hover:bg-red-600 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50"
                >
                  ${loading ? "Loading..." : "Next Question →"}
                </button>
              </${motion.div}>
            `}
          </${motion.div}>
        </div>
      `}
    </div>
  `;
}
