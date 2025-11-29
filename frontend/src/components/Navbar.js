import { React, html } from "/src/utils/htm.js";
import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";
import { UserContext } from "/src/context/UserContext.jsx";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  // Check if user is admin
  const isAdmin = localStorage.getItem("role") === "admin";

  const isActive = (path) => location.pathname === path ? "text-red-500 font-bold" : "text-gray-300 hover:text-white";

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    // Set timeout to close dropdown after 600ms
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 600);
  };

  function handleLogout() {
    logout();
    setShowDropdown(false);
    navigate("/");
  }

  return html`
    <nav className="bg-[#1E1E2E] border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <${Link} to="/" className="text-2xl font-bold tracking-tighter italic">
          LIGHTS <span className="text-red-600">OUT</span>
        </${Link}>
        
        <div className="flex items-center space-x-6">
          <${Link} to="/quiz" className=${isActive("/quiz")}>Quiz</${Link}>
          <${Link} to="/adaptive" className=${isActive("/adaptive")}>AI Quiz</${Link}>
          <${Link} to="/geo" className=${isActive("/geo")}>GeoGuessr</${Link}>
          <${Link} to="/leaderboard" className=${isActive("/leaderboard")}>Leaderboard</${Link}>
          ${isAdmin && html`
            <${Link} to="/admin" className="${isActive("/admin")} flex items-center gap-1">
              <span>🛡️</span>
              <span>Dashboard</span>
            </${Link}>
          `}
        </div>

        <div className="flex items-center space-x-4">
          ${user ? html`
            <div className="flex items-center space-x-4">
              <!-- Points Display -->
              <div className="flex items-center space-x-2 bg-[#2A2A3C] px-3 py-2 rounded-lg">
                <span className="text-yellow-400">⭐</span>
                <span className="font-mono font-bold">${user.points || 0}</span>
              </div>
              
              <!-- Coins Display -->
              <div className="flex items-center space-x-2 bg-[#2A2A3C] px-3 py-2 rounded-lg">
                <span className="text-yellow-600">🪙</span>
                <span className="font-mono font-bold">${user.coins || 0}</span>
              </div>
              
              <!-- User Profile Dropdown -->
              <div 
                className="relative"
                onMouseEnter=${handleMouseEnter}
                onMouseLeave=${handleMouseLeave}
              >
                <div className="flex items-center space-x-2 bg-[#2A2A3C] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#353548] transition-colors">
                  ${(() => {
        const pfp = user.profile_picture;
        if (pfp && pfp.startsWith("helmet_")) {
          const color = pfp.split("_")[1].split(".")[0];
          const colorMap = { red: "bg-red-600", blue: "bg-blue-600", yellow: "bg-yellow-500", green: "bg-green-600" };
          return html`<div className="w-8 h-8 rounded-full ${colorMap[color]} flex items-center justify-center text-sm mr-2">🏎️</div>`;
        } else if (pfp) {
          return html`<img src="/uploads/${pfp}" className="w-8 h-8 rounded-full object-cover mr-2" />`;
        } else {
          return html`<span className="text-2xl mr-2">👤</span>`;
        }
      })()}
                  <span className="font-bold">${user.username}</span>
                  <span 
                    className="text-xs"
                    style=${{
        display: 'inline-block',
        transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease'
      }}
                  >▼</span>
                </div>
                
                ${showDropdown ? html`
                  <div 
                    style=${{
          position: 'absolute',
          right: 0,
          marginTop: '0.5rem',
          width: '12rem',
          backgroundColor: '#2A2A3C',
          borderRadius: '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgb(55, 65, 81)',
          padding: '0.5rem 0',
          zIndex: 50,
          opacity: 0,
          transform: 'translateY(-10px)',
          animation: 'slideDown 0.3s ease-out forwards'
        }}
                    onMouseEnter=${handleMouseEnter}
                    onMouseLeave=${handleMouseLeave}
                  >
                    <${Link} 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-[#353548] transition-colors flex items-center space-x-2"
                      onClick=${() => setShowDropdown(false)}
                    >
                      <span>👤</span>
                      <span>Mi Perfil</span>
                    </${Link}>

                    ${localStorage.getItem("role") === "admin" && html`
                      <${Link} 
                        to="/admin" 
                        className="block px-4 py-2 hover:bg-[#353548] transition-colors flex items-center space-x-2 text-red-400"
                        onClick=${() => setShowDropdown(false)}
                      >
                        <span>🛡️</span>
                        <span>Admin Dashboard</span>
                      </${Link}>
                    `}
                    
                    <${Link} 
                      to="/settings" 
                      className="block px-4 py-2 hover:bg-[#353548] transition-colors flex items-center space-x-2"
                      onClick=${() => setShowDropdown(false)}
                    >
                      <span>⚙️</span>
                      <span>Configuración</span>
                    </${Link}>
                    
                    <div className="border-t border-gray-700 my-1"></div>
                    
                    <button 
                      onClick=${handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-900/30 transition-colors flex items-center space-x-2 text-red-400"
                    >
                      <span>🚪</span>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ` : null}
              </div>
            </div>
          ` : html`
            <div className="flex items-center space-x-3">
              <${Link} to="/register" className="text-gray-300 hover:text-white transition-colors">
                Register
              </${Link}>
              <${Link} to="/login" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition-colors">
                Login
              </${Link}>
            </div>
          `}
        </div>
      </div>
    </nav>
  `;
}
