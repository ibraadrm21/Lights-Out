import { React, html } from "/src/utils/htm.js";
import { useState } from "react";
import api from "/src/utils/api.js";
import { useNavigate } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";

export default function Settings() {

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
        <h2 className="text-2xl font-bold mb-4">Profile Picture</h2>
        
        <div className="flex items-start gap-8">
          <div className="flex-shrink-0 text-center">
            <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center border-4 border-gray-800 mb-2">
               ${(() => {
      const pfp = localStorage.getItem("profile_picture");
      if (pfp && pfp.startsWith("helmet_")) {
        const color = pfp.split("_")[1].split(".")[0];
        const colorMap = { red: "bg-red-600", blue: "bg-blue-600", yellow: "bg-yellow-500", green: "bg-green-600" };
        return html`<div className="w-full h-full ${colorMap[color]} flex items-center justify-center text-4xl">🏎️</div>`;
      } else if (pfp) {
        return html`<img src="/uploads/${pfp}" className="w-full h-full object-cover" />`;
      } else {
        return html`<span className="text-4xl">👤</span>`;
      }
    })()}
            </div>
            <span className="text-sm text-gray-400">Current</span>
          </div>

          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-3">Choose a Preset</h3>
            <div className="flex gap-4 mb-6">
              ${['red', 'blue', 'yellow', 'green'].map(color => html`
                <button 
                  onClick=${() => handlePresetSelect(`helmet_${color}.png`)}
                  className="w-16 h-16 rounded-full bg-${color === 'yellow' ? 'yellow-500' : color + '-600'} hover:opacity-80 transition-opacity flex items-center justify-center text-2xl border-2 border-transparent hover:border-white"
                  title="Select ${color} helmet"
                >
                  🏎️
                </button>
              `)}
            </div>

            <h3 className="text-lg font-semibold mb-3">Or Upload Your Own</h3>
            <div className="flex gap-4 items-center">
              <label className="cursor-pointer bg-[#262633] hover:bg-[#323242] text-white px-4 py-2 rounded border border-gray-700 transition-colors">
                <span>Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange=${handleFileUpload} />
              </label>
              <span className="text-sm text-gray-500">Max 2MB (JPG, PNG)</span>
            </div>
            ${pfpMessage && html`
                <div className=${pfpMessage.includes("✓") ? "text-green-500 mt-3" : "text-red-500 mt-3"}>
                  ${pfpMessage}
                </div>
            `}
          </div>
        </div>
      </div>

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
