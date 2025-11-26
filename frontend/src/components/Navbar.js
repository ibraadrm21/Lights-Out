import { React, html } from "/src/utils/htm.js";
import { Link, useNavigate } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";
import LanguageSelector from "/src/components/LanguageSelector.js";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  }

  return html`
    <nav className="bg-[#0f0f14] border-b border-gray-800 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <${Link} to="/" className="text-2xl font-black italic tracking-tighter text-white">
          LIGHTS <span className="text-[#FF1E00]">OUT</span>
        </${Link}>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
          <${Link} to="/quiz" className="hover:text-white transition-colors">QUIZ</${Link}>
          <${Link} to="/geo" className="hover:text-white transition-colors">GEO</${Link}>
          <${Link} to="/leaderboard" className="hover:text-white transition-colors">LEADERBOARD</${Link}>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <${LanguageSelector} />
        ${token ? html`
          <${Link} to="/profile" className="text-sm font-bold hover:text-warmRed">PROFILE</${Link}>
          <button onClick=${logout} className="text-sm text-gray-500 hover:text-white">LOGOUT</button>
        ` : html`
          <${Link} to="/login" className="text-sm font-bold hover:text-white">LOGIN</${Link}>
          <${Link} to="/register" className="bg-[#FF1E00] text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-red-600 transition-colors">JOIN</${Link}>
        `}
      </div>
    </nav>
  `;
}
