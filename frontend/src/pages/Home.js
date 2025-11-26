import { React, html } from "/src/utils/htm.js";
import { Link } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";
import AnimatedButton from "/src/components/AnimatedButton.js";
import { motion } from "https://esm.sh/framer-motion@10.16.4?external=react,react-dom";

export default function Home() {
    return html`
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <${motion.h1} 
        initial=${{ y: -50, opacity: 0 }}
        animate=${{ y: 0, opacity: 1 }}
        className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6"
      >
        LIGHTS <span className="text-[#FF1E00]">OUT</span>
      </${motion.h1}>
      <${motion.p} 
        initial=${{ opacity: 0 }}
        animate=${{ opacity: 1 }}
        transition=${{ delay: 0.2 }}
        className="text-xl text-gray-400 mb-10 max-w-lg"
      >
        The ultimate F1 trivia and geography challenge. Test your knowledge, climb the leaderboard, and prove you are the #1 fan.
      </${motion.p}>
      
      <div className="flex gap-6">
        <${Link} to="/quiz">
          <${AnimatedButton} className="text-xl px-8 py-3">START QUIZ</${AnimatedButton}>
        </${Link}>
        <${Link} to="/geo">
          <button className="px-8 py-3 border border-gray-600 rounded font-bold hover:border-white hover:bg-white/5 transition-all">
            GEO MODE
          </button>
        </${Link}>
      </div>
    </div>
  `;
}
