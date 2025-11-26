import { React, html } from "/src/utils/htm.js";
import { useState } from "react";
import api from "/src/utils/api.js";
import { useNavigate } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";
import AnimatedButton from "/src/components/AnimatedButton.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await api.post("/api/login", { username, password });
    if (res.error) {
      setError(res.error);
    } else {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user_id", res.user_id);
      localStorage.setItem("username", username);
      navigate("/profile");
    }
  }

  return html`
    <div className="max-w-sm mx-auto mt-16">
      <h2 className="text-3xl font-bold mb-6 text-center">Paddock Login</h2>
      <form onSubmit=${handleSubmit} className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800">
        ${error && html`<div className="bg-red-900/50 text-red-200 p-2 rounded mb-4 text-sm">${error}</div>`}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Username</label>
          <input 
            type="text" 
            value=${username} 
            onChange=${e => setUsername(e.target.value)}
            className="w-full bg-[#0f0f14] border border-gray-700 rounded p-2 focus:border-warmRed outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Password</label>
          <input 
            type="password" 
            value=${password} 
            onChange=${e => setPassword(e.target.value)}
            className="w-full bg-[#0f0f14] border border-gray-700 rounded p-2 focus:border-warmRed outline-none"
            required
          />
        </div>
        <${AnimatedButton} className="w-full">Enter Paddock</${AnimatedButton}>
      </form>
    </div>
  `;
}
