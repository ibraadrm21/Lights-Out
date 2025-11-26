import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Leaderboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/api/quiz/leaderboard").then(res => {
            if (res.leaderboard) setUsers(res.leaderboard);
        });
    }, []);

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Driver Standings</h2>

            <div className="bg-[#1f1f27] rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#262633] text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4">Pos</th>
                            <th className="p-4">Driver</th>
                            <th className="p-4 text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {users.map((u, i) => (
                            <tr key={u.user_id} className="hover:bg-[#262633] transition-colors">
                                <td className="p-4 font-mono text-gray-500">#{i + 1}</td>
                                <td className="p-4 font-bold text-white">{u.username}</td>
                                <td className="p-4 text-right text-[#FF1E00] font-bold font-mono">{u.score}</td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="3" className="p-8 text-center text-gray-500">No lap times recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
