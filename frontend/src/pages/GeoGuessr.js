import { React, html } from "/src/utils/htm.js";
import { useState, useEffect } from "react";
import api from "/src/utils/api.js";
import AnimatedButton from "/src/components/AnimatedButton.js";

export default function GeoGuessr() {
  const [geo, setGeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState(false);

  async function loadRandomGeo() {
    setLoading(true);
    setError(null);
    setRevealed(false);
    try {
      const data = await api.get(`/api/geo/random?t=${Date.now()}`);
      setGeo(data);
    } catch (err) {
      console.error("Failed to load geo:", err);
      const isVercel = window.location.hostname.includes('vercel.app');
      if (isVercel) {
        setError("⚠️ GeoGuessr requires a backend server. This feature only works on localhost:5000");
      } else {
        setError("Failed to load location. Make sure the backend is running on localhost:5000");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRandomGeo();
  }, []);

  return html`
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-warmRed">F1 GeoGuessr <span className="text-sm text-gray-500 font-normal">(Alpha)</span></h2>
      
      <div className="bg-[#1f1f27] rounded-lg overflow-hidden border border-gray-800">
        ${loading && html`
          <div className="text-gray-400 animate-pulse p-20 text-center">
            <div className="text-xl mb-2">🌍</div>
            Loading location...
          </div>
        `}
        
        ${error && html`
          <div className="p-20 text-center">
            <div className="text-red-500 mb-4">⚠️ ${error}</div>
            <${AnimatedButton} onClick=${loadRandomGeo}>Try Again</${AnimatedButton}>
          </div>
        `}
        
        ${!loading && !error && geo && html`
          <div className="w-full flex flex-col">
            <div className="w-full h-96 bg-black relative">
              <img 
                src=${geo.mapillary_image_id.startsWith("http") ? geo.mapillary_image_id : `https://images.mapillary.com/${geo.mapillary_image_id}/thumb-1024.jpg`} 
                alt="F1 Circuit Location" 
                className="w-full h-full object-cover"
                onError=${(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Image failed to load</div>';
      }}
              />
            </div>
            
            <div className="p-6 bg-[#262633]">
              ${!revealed ? html`
                <div className="text-center">
                  <p className="mb-4 text-gray-300">Where is this F1 location?</p>
                  <${AnimatedButton} onClick=${() => setRevealed(true)}>Reveal Location</${AnimatedButton}>
                </div>
              ` : html`
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">${geo.description}</h3>
                  <div className="text-gray-400 mb-4">
                    Lat: ${geo.lat.toFixed(4)}, Lon: ${geo.lon.toFixed(4)}
                  </div>
                  <${AnimatedButton} onClick=${loadRandomGeo}>Next Location</${AnimatedButton}>
                </div>
              `}
            </div>
          </div>
        `}
      </div>
      
      ${!loading && !error && html`
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>💡 Tip: This feature requires the backend server running on localhost:5000</p>
        </div>
      `}
    </div>
  `;
}
