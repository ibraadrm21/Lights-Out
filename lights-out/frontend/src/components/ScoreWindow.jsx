import React from "react";
import { motion } from "framer-motion";

export default function ScoreWindow({ score }) {
    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed right-6 top-24 bg-[#0f0f14] border border-[#FF1E00] p-4 rounded-lg shadow-[0_0_15px_rgba(255,30,0,0.3)] z-40"
        >
            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Current Score</div>
            <div className="text-3xl font-bold text-white tabular-nums">{score}</div>
        </motion.div>
    );
}
