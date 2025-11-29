import { React, html } from "/src/utils/htm.js";
import { useState, useEffect, useContext } from "react";
import api from "/src/utils/api.js";
import ScoreWindow from "/src/components/ScoreWindow.js";
import { motion } from "https://esm.sh/framer-motion@10.16.4?external=react,react-dom";
import { UserContext } from "/src/context/UserContext.jsx";

export default function Quiz() {
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rewards, setRewards] = useState(null);
  const { token, applyReward, user } = useContext(UserContext);

  async function startQuiz() {
    // Add timestamp to prevent caching
    const res = await api.get(`/api/quiz/start?count=${count}&t=${Date.now()}`);
    // Shuffle client-side as well to be double sure
    const shuffled = res.questions.sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setIdx(0);
    setScore(0);
    setFinished(false);
    setRewards(null);
  }

  async function answer(option) {
    const q = questions[idx];
    const correct = q.debug_correct; // EN PRODUCCIÓN remover
    if (option === correct) {
      setScore(s => s + 10);
    }

    if (idx + 1 >= questions.length) {
      // Quiz finished - calculate and submit results
      const finalScore = option === correct ? score + 10 : score;
      const scorePercentage = Math.round((finalScore / (questions.length * 10)) * 100);

      // Submit quiz result
      try {
        const res = await fetch("/api/quiz/result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            score_percentage: scorePercentage,
            quiz_id: 1,
            base_points: 100
          })
        });

        const result = await res.json();
        setRewards(result);

        // If user is authenticated, apply rewards to UI
        if (token && result.points_awarded && result.coins_awarded) {
          applyReward(result.points_awarded, result.coins_awarded);
        }
      } catch (error) {
        console.error("Failed to submit quiz result:", error);
      }

      setFinished(true);
    } else {
      setIdx(idx + 1);
    }
  }

  return html`
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-warmRed">F1 Quiz Master</h2>
      ${!questions.length && html`
        <div className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800">
          <div className="mb-6">
            <label className="block mb-2 text-lg text-gray-300">Number of Questions:</label>
            <select value=${count} onChange=${e => setCount(Number(e.target.value))} className="w-full bg-[#262633] p-3 rounded border border-gray-700 focus:border-warmRed outline-none text-white">
              <option value=${10}>10 Questions</option>
              <option value=${20}>20 Questions</option>
              <option value=${50}>50 Questions</option>
            </select>
          </div>

          <button onClick=${startQuiz} className="w-full bg-[#FF1E00] hover:bg-red-600 text-white font-bold py-4 px-6 rounded transition-colors text-lg shadow-lg shadow-red-900/20">
            START RACE 🏎️
          </button>
        </div>
      `}

      ${questions.length > 0 && !finished && html`
        <div className="mt-6">
          <div className="mb-2 text-gray-400">Lap ${idx + 1} / ${questions.length}</div>
          <${motion.div} 
            key=${idx}
            initial=${{ opacity: 0, x: 20 }}
            animate=${{ opacity: 1, x: 0 }}
            className="p-6 bg-[#1f1f27] rounded-lg border border-gray-800 shadow-xl"
          >
            <div className="mb-6 text-xl font-medium">${questions[idx].text}</div>
            <div className="grid grid-cols-1 gap-3">
              ${["A", "B", "C", "D"].map(opt => html`
                <button key=${opt} onClick=${() => answer(opt)} className="p-4 bg-[#262633] rounded hover:bg-[#2b2b39] hover:border-warmRed border border-transparent text-left transition-all">
                  <span className="font-bold text-warmRed mr-2">${opt}.</span> ${questions[idx][opt]}
                </button>
              `)}
            </div>
          </${motion.div}>
        </div>
      `}

      <${ScoreWindow} score=${score} />

      ${finished && html`
        <${motion.div} 
          initial=${{ scale: 0.9, opacity: 0 }}
          animate=${{ scale: 1, opacity: 1 }}
          className="mt-8 p-8 bg-[#1f1f27] rounded-lg text-center border border-warmRed"
        >
          <h3 className="text-2xl font-bold mb-2">Chequered Flag! 🏁</h3>
          <div className="text-4xl font-bold text-warmRed mb-4">${score} pts</div>
          
          ${rewards && html`
            <div className="mb-6 space-y-3">
              <div className="bg-[#2A2A3C] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Points Earned</div>
                <div className="text-2xl font-bold text-yellow-400">⭐ ${rewards.points_awarded}</div>
              </div>
              <div className="bg-[#2A2A3C] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Coins Earned</div>
                <div className="text-2xl font-bold text-yellow-600">🪙 ${rewards.coins_awarded}</div>
              </div>
              
              ${!token && html`
                <div className="bg-blue-900/30 border border-blue-500 text-blue-200 px-4 py-3 rounded mt-4">
                  <p className="font-bold mb-2">💡 Tip: Register to save your progress!</p>
                  <p className="text-sm">Your rewards were calculated but not saved. Create an account to track your points and compete on the leaderboard!</p>
                  <a href="/register" className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition-colors">
                    Register Now
                  </a>
                </div>
              `}
              
              ${token && rewards.points_total !== undefined && html`
                <div className="text-sm text-gray-400 mt-4">
                  Total: ${rewards.points_total} points | ${rewards.coins_total} coins
                </div>
              `}
            </div>
          `}
          
          <button onClick=${() => setQuestions([])} className="text-gray-400 hover:text-white underline">Back to Paddock</button>
        </${motion.div}>
      `}
    </div>
  `;
}
