import { React, html } from "/src/utils/htm.js";
import Navbar from "/src/components/Navbar.js";
import Home from "/src/pages/Home.js";
import GeoGuessr from "/src/pages/GeoGuessr.js";
import Profile from "/src/pages/Profile.js";
import Settings from "/src/pages/Settings.js";
import Leaderboard from "/src/pages/Leaderboard.js";
import Login from "/src/pages/Login.js";
import Register from "/src/pages/Register.js";
import AdaptiveQuiz from "/src/pages/AdaptiveQuiz.js";
import AdminDashboard from "/src/pages/AdminDashboard.js";

import { BrowserRouter as Router, Routes as Routes_, Route as Route_ } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";

export default function App() {
  return html`
    <${Router}>
      <div className="min-h-screen bg-[#15151E] text-white font-sans">
        <${Navbar} />
        <main className="p-4 container mx-auto">
          <${Routes_}>
            <${Route_} path="/" element=${html`<${Home} />`} />
            <${Route_} path="/quiz" element=${html`<${AdaptiveQuiz} />`} />
            <${Route_} path="/adaptive" element=${html`<${AdaptiveQuiz} />`} />
            <${Route_} path="/geo" element=${html`<${GeoGuessr} />`} />
            <${Route_} path="/profile" element=${html`<${Profile} />`} />
            <${Route_} path="/settings" element=${html`<${Settings} />`} />
            <${Route_} path="/leaderboard" element=${html`<${Leaderboard} />`} />
            <${Route_} path="/login" element=${html`<${Login} />`} />
            <${Route_} path="/register" element=${html`<${Register} />`} />
            <${Route_} path="/admin" element=${html`<${AdminDashboard} />`} />
          </${Routes_}>
        </main>
      </div>
    </${Router}>
  `;
}
