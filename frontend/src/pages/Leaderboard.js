import { React, html } from "/src/utils/htm.js";
import { useState, useEffect } from "react";
import api from "/src/utils/api.js";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/api/quiz/leaderboard").then(res => {
      if (res.leaderboard) setUsers(res.leaderboard);
    });
  }, []);

  return html`
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-warmRed">Leaderboard</h2>
      <div className="bg-[#1f1f27] rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#262633] text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Driver</th>
              <th className="px-6 py-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            ${users.map((u, i) => html`
              <tr key=${u.user_id} className="hover:bg-[#262633] transition-colors">
                <td className="px-6 py-4 font-mono text-gray-500">#${i + 1}</td>
                <td className="px-6 py-4 font-bold text-white">${u.username}</td>
                <td className="px-6 py-4 text-right font-mono text-warmRed">${u.score}</td>
              </tr>
            `)}
            ${users.length === 0 && html`
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No drivers yet. Be the first!</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
