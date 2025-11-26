import { React, html } from "/src/utils/htm.js";
import { motion } from "https://esm.sh/framer-motion@10.16.4?external=react,react-dom";

export default function AnimatedButton({ children, onClick, className = "" }) {
    return html`
    <${motion.button}
      whileHover=${{ scale: 1.05 }}
      whileTap=${{ scale: 0.95 }}
      onClick=${onClick}
      className=${`bg-[#FF1E00] text-white font-bold py-2 px-6 rounded shadow-lg hover:shadow-red-900/50 transition-shadow ${className}`}
    >
      ${children}
    </${motion.button}>
  `;
}
