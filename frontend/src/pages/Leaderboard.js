import { React, html } from "/src/utils/htm.js";
import { useState, useEffect } from "react";
import api from "/src/utils/api.js";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    api.get("/api/quiz/leaderboard").then(res => {
      if (res.leaderboard) setUsers(res.leaderboard);
    });
  }, []);

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-orange-400";
    return "text-gray-500";
  };

  return html`
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-warmRed">🏆 Leaderboard</h2>
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
            ${users.map((u) => {
    const isCurrentUser = currentUserId && u.user_id === parseInt(currentUserId);
    const rowClass = isCurrentUser
      ? "bg-warmRed bg-opacity-10 hover:bg-opacity-20 transition-colors border-l-4 border-warmRed"
      : "hover:bg-[#262633] transition-colors";

    return html`
                <tr key=${u.user_id} className=${rowClass}>
                  <td className="px-6 py-4 font-mono ${getRankColor(u.rank)} font-bold text-lg">
                    ${getRankIcon(u.rank)}
                  </td>
                  <td className="px-6 py-4 font-bold ${isCurrentUser ? 'text-warmRed' : 'text-white'}">
                    ${u.username}
                    ${isCurrentUser ? html`<span className="ml-2 text-xs text-gray-400">(You)</span>` : ''}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-warmRed font-bold">
                    ${u.total}
                  </td>
                </tr>
              `;
  })}
            ${users.length === 0 && html`
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                  No drivers yet. Be the first!
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
