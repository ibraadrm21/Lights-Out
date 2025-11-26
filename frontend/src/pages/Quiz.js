import { React, html } from "/src/utils/htm.js";
import { useState, useEffect } from "react";
import api from "/src/utils/api.js";
import ScoreWindow from "/src/components/ScoreWindow.js";
import { motion } from "https://esm.sh/framer-motion@10.16.4?external=react,react-dom";

export default function Quiz() {
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    // no cargar preguntas hasta que se presione start
  }, []);

  async function startQuiz() {
    // Add timestamp to prevent caching
    const res = await api.get(`/api/quiz/start?count=${count}&t=${Date.now()}`);
    // Shuffle client-side as well to be double sure
    const shuffled = res.questions.sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setIdx(0);
    setScore(0);
    setFinished(false);
  }

  function answer(option) {
    const q = questions[idx];
    const correct = q.debug_correct; // EN PRODUCCIÓN remover
    if (option === correct) {
      setScore(s => s + 10);
      // animación / feedback
    } else {
      // feedback incorrecto
    }
    if (idx + 1 >= questions.length) {
      setFinished(true);
      // Guardar puntos si hay sesión
      if (token && userId) {
        api.post(`/api/points/${userId}`, { score, mode: "quiz" }, token);
        // actualizar leaderboard client-side si quieres
      }
    } else {
      setIdx(idx + 1);
    }
  }

  return html`
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-warmRed">F1 Quiz Master</h2>
      ${!questions.length && html`
        <div className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800">
          <label className="block mb-4 text-lg">Number of Questions:
            <select value=${count} onChange=${e => setCount(Number(e.target.value))} className="ml-3 bg-[#262633] p-2 rounded border border-gray-700 focus:border-warmRed outline-none">
              <option value=${10}>10</option>
              <option value=${20}>20</option>
              <option value=${50}>50</option>
            </select>
          </label>
          <button onClick=${startQuiz} className="bg-[#FF1E00] hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition-colors">Start Race</button>
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
          <button onClick=${() => setQuestions([])} className="text-gray-400 hover:text-white underline">Back to Paddock</button>
        </${motion.div}>
      `}
    </div>
  `;
}
