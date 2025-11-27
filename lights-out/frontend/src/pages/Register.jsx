import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import AnimatedButton from "../components/AnimatedButton";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const res = await api.post("/api/register", { username, password });
        if (res.error) {
            setError(res.error);
        } else {
            localStorage.setItem("token", res.token);
            localStorage.setItem("user_id", res.user_id);
            localStorage.setItem("username", username);
            navigate("/");
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20">
            <div className="bg-[#1f1f27] p-8 rounded-xl border border-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-center">Join the Grid</h2>
                {error && <div className="bg-red-900/20 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input
                            className="w-full bg-[#0f0f14] border border-gray-700 rounded p-3 text-white focus:border-[#FF1E00] outline-none transition-colors"
                            value={username} onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-[#0f0f14] border border-gray-700 rounded p-3 text-white focus:border-[#FF1E00] outline-none transition-colors"
                            value={password} onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <AnimatedButton className="w-full py-3 mt-4">Create Account</AnimatedButton>
                </form>
            </div>
        </div>
    );
}
