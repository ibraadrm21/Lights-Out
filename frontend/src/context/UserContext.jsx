// UserContext.jsx
import { React, html } from "/src/utils/htm.js";
import { createContext, useState, useEffect } from "react";
import api from "/src/utils/api.js";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            // Fetch user profile
            fetch("/api/user", {
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(resp => {
                    if (resp && !resp.error) {
                        setUser(resp);
                    } else {
                        // Token invalid -> clear
                        setToken(null);
                        localStorage.removeItem("token");
                        localStorage.removeItem("user_id");
                        localStorage.removeItem("username");
                        localStorage.removeItem("role");
                        localStorage.removeItem("profile_picture");
                        setUser(null);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch user profile:", err);
                    setToken(null);
                    localStorage.removeItem("token");
                    setUser(null);
                });
        }
    }, [token]);

    const saveToken = (t, userData) => {
        setToken(t);
        localStorage.setItem("token", t);
        if (userData) {
            localStorage.setItem("user_id", userData.id);
            localStorage.setItem("username", userData.username);
            // Save role if provided
            if (userData.role) {
                localStorage.setItem("role", userData.role);
            }
            // Save pfp if provided
            if (userData.profile_picture) {
                localStorage.setItem("profile_picture", userData.profile_picture);
            }

            setUser({
                id: userData.id,
                username: userData.username,
                points: userData.points || 0,
                coins: userData.coins || 0,
                role: userData.role || 'user',
                profile_picture: userData.profile_picture || null
            });
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("profile_picture");
        setUser(null);
    };

    // Apply reward locally for instant UI feedback
    const applyReward = (points_awarded, coins_awarded) => {
        setUser(prev => prev ? {
            ...prev,
            points: prev.points + points_awarded,
            coins: prev.coins + coins_awarded
        } : prev);
    };

    return html`
    <${UserContext.Provider} value=${{ user, token, saveToken, logout, setUser, applyReward }}>
      ${children}
    </${UserContext.Provider}>
  `;
}
