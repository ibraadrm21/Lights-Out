import { React, html } from "/src/utils/htm.js";
import { motion } from "https://esm.sh/framer-motion@10.16.4?external=react,react-dom";

export default function ScoreWindow({ score }) {
    return html`
    <${motion.div} 
      initial=${{ y: -20, opacity: 0 }}
      animate=${{ y: 0, opacity: 1 }}
      className="fixed right-6 top-24 bg-[#0f0f14] border border-[#FF1E00] p-4 rounded-lg shadow-lg z-50"
    >
      <div className="text-xs text-gray-400 uppercase tracking-wider">Current Score</div>
      <div className="text-2xl font-bold text-white font-mono">${score}</div>
    </${motion.div}>
  `;
}
