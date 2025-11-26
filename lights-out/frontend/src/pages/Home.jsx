import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedButton from "../components/AnimatedButton";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
                    LIGHTS <span className="text-[#FF1E00]">OUT</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                    The ultimate F1 trivia and geography challenge. Test your knowledge, compete on the leaderboard, and master the grid.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link to="/quiz">
                        <AnimatedButton className="text-lg px-8 py-4">
                            Start Quiz
                        </AnimatedButton>
                    </Link>
                    <Link to="/geo">
                        <AnimatedButton variant="secondary" className="text-lg px-8 py-4">
                            GeoGuessr Mode
                        </AnimatedButton>
                    </Link>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full max-w-5xl">
                {[
                    { title: "1000+ Questions", desc: "Deep dive into history, tech, and stats." },
                    { title: "Global Leaderboard", desc: "Compete with fans worldwide." },
                    { title: "Track Mastery", desc: "Identify corners and circuits from images." }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="bg-[#1f1f27] p-6 rounded-xl border border-gray-800"
                    >
                        <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                        <p className="text-gray-400">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
