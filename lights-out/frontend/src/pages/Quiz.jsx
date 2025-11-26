import React, { useEffect, useState } from "react";
import api from "../utils/api";
import ScoreWindow from "../components/ScoreWindow";
import AnimatedButton from "../components/AnimatedButton";
import { motion, AnimatePresence } from "framer-motion";

export default function Quiz() {
    const [count, setCount] = useState(10);
    const [questions, setQuestions] = useState([]);
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null); // true/false

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    async function startQuiz() {
        setLoading(true);
        try {
            const res = await api.get(`/api/quiz/start?count=${count}`);
            setQuestions(res.questions);
            setIdx(0);
            setScore(0);
            setFinished(false);
            setLastAnswerCorrect(null);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    function answer(option) {
        const q = questions[idx];
        const correct = q.debug_correct; // EN PRODUCCIÓN remover y validar en backend idealmente

        const isCorrect = option === correct;
        setLastAnswerCorrect(isCorrect);

        if (isCorrect) {
            setScore(s => s + 10);
        }

        setTimeout(() => {
            if (idx + 1 >= questions.length) {
                finishQuiz(score + (isCorrect ? 10 : 0)); // Pass updated score
            } else {
                setIdx(idx + 1);
                setLastAnswerCorrect(null);
            }
        }, 800); // Delay to show feedback
    }

    function finishQuiz(finalScore) {
        setFinished(true);
        if (token && userId) {
            api.post(`/api/points/${userId}`, { score: finalScore, mode: "quiz" }, token);
        }
    }

    return (
        <div className="max-w-2xl mx-auto pt-10">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">F1 Quiz Master</h2>
                {questions.length > 0 && !finished && (
                    <div className="text-gray-400">Q {idx + 1} / {questions.length}</div>
                )}
            </div>

            {!questions.length && !finished && (
                <div className="bg-[#1f1f27] p-8 rounded-xl border border-gray-800 text-center">
                    <h3 className="text-xl mb-6">Select Difficulty</h3>
                    <div className="flex justify-center gap-4 mb-8">
                        {[10, 20, 50].map(n => (
                            <button
                                key={n}
                                onClick={() => setCount(n)}
                                className={`px-6 py-3 rounded-lg font-bold border ${count === n ? 'bg-[#FF1E00] border-[#FF1E00] text-white' : 'border-gray-600 text-gray-400 hover:border-white'}`}
                            >
                                {n} Questions
                            </button>
                        ))}
                    </div>
                    <AnimatedButton onClick={startQuiz} className="w-full py-4 text-xl">
                        {loading ? "Loading..." : "Start Race"}
                    </AnimatedButton>
                </div>
            )}

            {questions.length > 0 && !finished && (
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-[#1f1f27] p-6 rounded-xl border border-gray-800 shadow-2xl"
                        >
                            <div className="text-lg md:text-xl font-medium mb-6 leading-relaxed">
                                {questions[idx].text}
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {["A", "B", "C", "D"].map(opt => {
                                    let btnClass = "p-4 text-left rounded-lg transition-all border border-transparent bg-[#262633] hover:bg-[#323242]";

                                    // Show feedback if answered
                                    if (lastAnswerCorrect !== null) {
                                        if (opt === questions[idx].debug_correct) btnClass = "p-4 text-left rounded-lg border border-green-500 bg-green-900/20 text-green-400";
                                        else if (opt === questions[idx].debug_correct && lastAnswerCorrect === false) btnClass = "p-4 text-left rounded-lg border border-red-500 bg-red-900/20 text-red-400";
                                    }

                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => !lastAnswerCorrect && answer(opt)}
                                            disabled={lastAnswerCorrect !== null}
                                            className={btnClass}
                                        >
                                            <span className="font-bold text-gray-500 mr-3">{opt}.</span>
                                            {questions[idx][opt]}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            <ScoreWindow score={score} />

            {finished && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#1f1f27] p-10 rounded-xl border border-gray-800 text-center"
                >
                    <h3 className="text-2xl font-bold mb-2">Chequered Flag!</h3>
                    <div className="text-6xl font-black text-[#FF1E00] mb-4">{score}</div>
                    <p className="text-gray-400 mb-8">Points secured</p>

                    <div className="flex gap-4 justify-center">
                        <AnimatedButton onClick={() => { setQuestions([]); setFinished(false); }}>
                            Race Again
                        </AnimatedButton>
                        <Link to="/leaderboard">
                            <AnimatedButton variant="secondary">
                                View Leaderboard
                            </AnimatedButton>
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
