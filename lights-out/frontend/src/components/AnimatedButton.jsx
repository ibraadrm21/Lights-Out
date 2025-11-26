import React from "react";
import { motion } from "framer-motion";

export default function AnimatedButton({ children, onClick, className = "", variant = "primary" }) {
    const baseStyle = "px-6 py-2 rounded font-bold transition-all duration-200 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-[#FF1E00] text-white hover:bg-red-600 shadow-lg shadow-red-900/20",
        secondary: "bg-[#262633] text-white hover:bg-[#323242]",
        outline: "border border-gray-600 text-gray-300 hover:border-white hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </motion.button>
    );
}
