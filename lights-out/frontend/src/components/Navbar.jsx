import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        navigate("/login");
    }

    return (
        <nav className="bg-[#0f0f14] border-b border-gray-800 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
                    <span className="text-[#FF1E00]">●●●●●</span> LIGHTS OUT
                </Link>

                <div className="flex gap-6 items-center text-sm font-medium text-gray-300">
                    <Link to="/quiz" className="hover:text-[#FF1E00] transition-colors">Quiz</Link>
                    <Link to="/geo" className="hover:text-[#FF1E00] transition-colors">GeoGuessr</Link>
                    <Link to="/leaderboard" className="hover:text-[#FF1E00] transition-colors">Leaderboard</Link>

                    {token ? (
                        <>
                            <span className="text-gray-500">|</span>
                            <Link to="/profile" className="hover:text-white">{username}</Link>
                            <button onClick={logout} className="text-[#FF1E00] hover:text-red-400">Logout</button>
                        </>
                    ) : (
                        <>
                            <span className="text-gray-500">|</span>
                            <Link to="/login" className="hover:text-white">Login</Link>
                            <Link to="/register" className="bg-[#FF1E00] text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
