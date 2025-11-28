import { React, html } from "/src/utils/htm.js";
import { useState } from "react";
import api from "/src/utils/api.js";
import { motion } from "https://esm.sh/framer-motion@10.16.4?external=react,react-dom";

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
    }
  }

<<<<<<< Updated upstream
  function handleAnswer(selectedIndex) {
    if (showExplanation) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedIndex === (currentQ.debug_correct.charCodeAt(0) - 65); // A=0, B=1, C=2, D=3

    setSelectedAnswer(selectedIndex);
    setShowExplanation(true);

    if (isCorrect) {
      setScore(score + 10);
=======
    setPlayerState(newState);
    setQuestionsAnswered(questionsAnswered + 1);
    setShowExplanation(true);

    // Save points if logged in
    if (token && userId && isCorrect) {
      const pointsUrl = "/api/points/" + userId;
      api.post(pointsUrl, { score: 10, mode: "adaptive" }, token);
>>>>>>> Stashed changes
    }
  }

<<<<<<< Updated upstream
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
=======
    // Pre-fetch NEXT question now (while user is reading explanation)
    // We use the updated state and the current seen list + current question
    // Note: nextQuestionData might already be populated from previous pre-fetch, 
    // but we need to ensure we have a buffer. 
    // Actually, the best strategy is:
    // 1. If we have nextQuestionData, great.
    // 2. If not, we fetch it now.
    // But wait, we want to fetch question N+2 while user views N's explanation?
    // No, we just need to ensure N+1 is ready.

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

  const startedContent = started && html`<${RankBadge} rank=${playerState.rank} />`;
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
              ${["A", "B", "C", "D"].map((letter, index) => {
    let buttonClass = "p-4 bg-[#262633] rounded border transition-all text-left";

    if (showExplanation) {
      if (index === correctIndex) {
        buttonClass += " border-green-500 bg-green-900/20";
      } else if (selectedAnswer === index && index !== correctIndex) {
=======
              ${currentQuestion.options.map((option, index) => {
    let buttonClass = "p-4 bg-[#262633] rounded border transition-all text-left";

    if (showExplanation) {
      if (index === currentQuestion.correct_answer_index) {
        buttonClass += " border-green-500 bg-green-900/20";
      } else if (lastAnswer && index === lastAnswer.selectedIndex && !lastAnswer.correct) {
>>>>>>> Stashed changes
        buttonClass += " border-red-500 bg-red-900/20";
      } else {
        buttonClass += " border-gray-700 opacity-50";
      }
    } else {
      buttonClass += " hover:bg-[#2b2b39] hover:border-warmRed border-transparent cursor-pointer";
    }

<<<<<<< Updated upstream
    const correctIcon = showExplanation && index === correctIndex ? html`<span className="ml-2 text-green-400">✓</span>` : null;
=======
    const correctIcon = showExplanation && index === currentQuestion.correct_answer_index ? html`<span className="ml-2 text-green-400">✓</span>` : null;
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
                <div className="mb-4 text-sm">
                  ${selectedAnswer === correctIndex
          ? html`<span className="text-green-400 text-lg">✓ Correct! +10 points</span>`
          : html`<span className="text-red-400 text-lg">✗ Incorrect</span>`
        }
                </div>
=======
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
>>>>>>> Stashed changes
                
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
