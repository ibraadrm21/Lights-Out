import { React, html } from "/src/utils/htm.js";
import { useState } from "react";
import api from "/src/utils/api.js";
import { useNavigate } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";

export default function Settings() {
    const [usernameInput, setUsernameInput] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const navigate = useNavigate();

    const currentUsername = localStorage.getItem("username") || "";
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return null;
    }

    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        setUsernameMessage("");

        if (!usernameInput.trim()) {
            setUsernameMessage("Please enter a username");
            return;
        }

        if (usernameInput.length < 3) {
            setUsernameMessage("Username must be at least 3 characters");
            return;
        }

        setUsernameLoading(true);

        try {
            const response = await fetch("/api/user/update-username", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ username: usernameInput })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem("username", data.username);
                localStorage.setItem("token", data.token);
                setUsernameMessage("✓ Username updated successfully!");
                setUsernameInput("");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                if (data.error === "username_exists") {
                    setUsernameMessage("❌ Username already taken");
                } else if (data.error === "username_too_short") {
                    setUsernameMessage("❌ Username must be at least 3 characters");
                } else {
                    setUsernameMessage("❌ Failed to update username");
                }
            }
        } catch (error) {
            setUsernameMessage("❌ Network error. Please try again.");
        } finally {
            setUsernameLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordMessage("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage("Please fill in all password fields");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage("New password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage("New passwords don't match");
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await fetch("/api/user/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setPasswordMessage("✓ Password updated successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                if (data.error === "invalid_current_password") {
                    setPasswordMessage("❌ Current password is incorrect");
                } else if (data.error === "password_too_short") {
                    setPasswordMessage("❌ Password must be at least 6 characters");
                } else {
                    setPasswordMessage("❌ Failed to update password");
                }
            }
        } catch (error) {
            setPasswordMessage("❌ Network error. Please try again.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return html`
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="mb-6">
        <button
          onClick=${() => navigate("/profile")}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Profile
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-warmRed">Settings</h1>

      <div className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800 mb-6">
        <h2 className="text-2xl font-bold mb-4">Change Username</h2>
        <p className="text-gray-400 mb-4">Current username: <span className="text-white font-semibold">${currentUsername}</span></p>
        
        <form onSubmit=${handleUsernameUpdate}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">New Username</label>
            <input
              type="text"
              value=${usernameInput}
              onChange=${(e) => setUsernameInput(e.target.value)}
              placeholder="Enter new username"
              className="w-full px-4 py-3 bg-[#262633] border border-gray-700 rounded focus:outline-none focus:border-warmRed transition-colors"
              disabled=${usernameLoading}
            />
          </div>

          ${usernameMessage && html`
            <div className=${usernameMessage.includes("✓") ? "text-green-500 mb-4" : "text-red-500 mb-4"}>
              ${usernameMessage}
            </div>
          `}

          <button
            type="submit"
            disabled=${usernameLoading}
            className="w-full bg-warmRed hover:bg-red-600 text-white font-bold py-3 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ${usernameLoading ? "Updating..." : "Update Username"}
          </button>
        </form>
      </div>

      <div className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        
        <form onSubmit=${handlePasswordUpdate}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Current Password</label>
            <input
              type="password"
              value=${currentPassword}
              onChange=${(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-3 bg-[#262633] border border-gray-700 rounded focus:outline-none focus:border-warmRed transition-colors"
              disabled=${passwordLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">New Password</label>
            <input
              type="password"
              value=${newPassword}
              onChange=${(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="w-full px-4 py-3 bg-[#262633] border border-gray-700 rounded focus:outline-none focus:border-warmRed transition-colors"
              disabled=${passwordLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
            <input
              type="password"
              value=${confirmPassword}
              onChange=${(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 bg-[#262633] border border-gray-700 rounded focus:outline-none focus:border-warmRed transition-colors"
              disabled=${passwordLoading}
            />
          </div>

          ${passwordMessage && html`
            <div className=${passwordMessage.includes("✓") ? "text-green-500 mb-4" : "text-red-500 mb-4"}>
              ${passwordMessage}
            </div>
          `}

          <button
            type="submit"
            disabled=${passwordLoading}
            className="w-full bg-warmRed hover:bg-red-600 text-white font-bold py-3 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ${passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  `;
}
