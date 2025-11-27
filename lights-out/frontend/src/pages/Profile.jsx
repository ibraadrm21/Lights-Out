import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Profile() {
    const [points, setPoints] = useState(0);
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (userId && token) {
            api.get(`/api/points/${userId}`, token).then(res => {
                setPoints(res.total);
            });
        }
    }, [userId, token]);

    if (!token) return <div className="p-10 text-center">Please login to view profile.</div>;

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-[#1f1f27] p-8 rounded-xl border border-gray-800 text-center">
                <div className="w-20 h-20 bg-[#262633] rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-500">
                    {username?.[0]?.toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold mb-2">{username}</h2>
                <div className="text-gray-400 mb-6">Super License Holder</div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#0f0f14] p-4 rounded-lg border border-gray-800">
                        <div className="text-xs text-gray-500 uppercase mb-1">Career Points</div>
                        <div className="text-3xl font-black text-[#FF1E00]">{points}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
