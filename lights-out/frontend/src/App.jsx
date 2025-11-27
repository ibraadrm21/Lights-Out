import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import GeoGuessr from "./pages/GeoGuessr";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#15151E] text-white font-sans">
                <Navbar />
                <main className="p-4 max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/geo" element={<GeoGuessr />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
