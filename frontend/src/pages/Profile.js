import { React, html } from "/src/utils/htm.js";
import { useState, useEffect } from "react";
import api from "/src/utils/api.js";
import { useNavigate } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";

export default function Profile() {
  const [points, setPoints] = useState(0);
  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username") || "Driver";
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    api.get(`/api/points/${userId}`).then(res => {
      if (res.total !== undefined) setPoints(res.total);
    });
  }, [userId, navigate]);

  return html`
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-[#1f1f27] p-8 rounded-lg border border-gray-800 text-center">
        <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-400">
          ${username[0].toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold mb-2">${username}</h2>
        <div className="text-gray-500 mb-6">Super License Active</div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#262633] p-4 rounded border border-gray-700">
            <div className="text-sm text-gray-400 uppercase">Career Points</div>
            <div className="text-3xl font-bold text-warmRed">${points}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
