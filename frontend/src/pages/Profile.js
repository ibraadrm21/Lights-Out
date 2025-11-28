import { React, html } from "/src/utils/htm.js";
import { useState, useEffect } from "react";
import api from "/src/utils/api.js";
import { useNavigate } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";

export default function Profile() {
  const [stats, setStats] = useState({ total_points: 0, coins: 0, rank: null });
  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username") || "Driver";
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    api.get(`/api/user/${userId}`).then(res => {
      if (res.total_points !== undefined) {
        setStats({
          total_points: res.total_points || 0,
          coins: res.coins || 0,
          rank: res.rank
        });
      }
    });
  }, [userId, navigate]);

  return html`
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-[#1f1f27] p-8 rounded-lg border border-gray-800 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-warmRed to-red-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
          ${username[0].toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold mb-2">${username}</h2>
        <div className="text-gray-500 mb-6">Super License Active</div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#262633] p-4 rounded border border-gray-700">
            <div className="text-sm text-gray-400 uppercase">Career Points</div>
            <div className="text-3xl font-bold text-warmRed">${stats.total_points}</div>
          </div>
          <div className="bg-[#262633] p-4 rounded border border-gray-700">
            <div className="text-sm text-gray-400 uppercase">Coins</div>
            <div className="text-3xl font-bold text-yellow-500">${stats.coins}</div>
          </div>
        </div>

        ${stats.rank && html`
          <div className="bg-[#262633] p-4 rounded border border-gray-700 mb-6">
            <div className="text-sm text-gray-400 uppercase">Global Rank</div>
            <div className="text-2xl font-bold text-white">#${stats.rank}</div>
          </div>
        `}

        <button
          onClick=${() => navigate("/settings")}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded transition-all"
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  `;
}
