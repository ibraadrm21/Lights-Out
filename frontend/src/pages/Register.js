import { React, html } from "/src/utils/htm.js";
import { useState, useContext } from "react";
import { useNavigate } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";
import { UserContext } from "/src/context/UserContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const { saveToken } = useContext(UserContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const resp = await res.json();

      if (resp.error) {
        setErr(resp.error);
      } else if (resp.token) {
        saveToken(resp.token, resp.user);
        navigate("/");
      } else {
        setErr("Error inesperado");
      }
    } catch (error) {
      setErr("Error de conexión");
    }
  };

  return html`
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit=${submit} className="bg-[#1f1f27] p-8 rounded-lg border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-warmRed">Crear cuenta</h2>
        ${err && html`<div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">${err}</div>`}
        
        <div className="mb-4">
          <label className="block mb-2 text-gray-300">Usuario</label>
          <input 
            placeholder="Usuario" 
            value=${form.username} 
            onChange=${e => setForm({ ...form, username: e.target.value })} 
            required 
            className="w-full bg-[#262633] p-3 rounded border border-gray-700 focus:border-warmRed outline-none text-white"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-gray-300">Email</label>
          <input 
            placeholder="tu@email.com" 
            type="email"
            value=${form.email} 
            onChange=${e => setForm({ ...form, email: e.target.value })} 
            required 
            className="w-full bg-[#262633] p-3 rounded border border-gray-700 focus:border-warmRed outline-none text-white"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-gray-300">Contraseña</label>
          <input 
            placeholder="Contraseña" 
            type="password" 
            value=${form.password} 
            onChange=${e => setForm({ ...form, password: e.target.value })} 
            required 
            className="w-full bg-[#262633] p-3 rounded border border-gray-700 focus:border-warmRed outline-none text-white"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-[#FF1E00] hover:bg-red-600 text-white font-bold py-3 px-6 rounded transition-colors"
        >
          Registrar
        </button>
        
        <p className="mt-4 text-center text-gray-400">
          ¿Ya tienes cuenta? <a href="/login" className="text-warmRed hover:underline">Inicia sesión</a>
        </p>
      </form>
    </div>
  `;
}
