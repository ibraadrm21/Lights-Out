import React, { useEffect, useState } from "react";
import api from "../utils/api";
import AnimatedButton from "../components/AnimatedButton";

export default function GeoGuessr() {
    const [geo, setGeo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [revealed, setRevealed] = useState(false);

    async function loadRandomGeo() {
        setLoading(true);
        setRevealed(false);
        try {
            const res = await api.get("/api/geo/random");
            setGeo(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRandomGeo();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">F1 GeoGuessr</h2>
                <AnimatedButton onClick={loadRandomGeo} variant="secondary">
                    Next Location
                </AnimatedButton>
            </div>

            {loading && <div className="text-center py-20">Loading satellite data...</div>}

            {!loading && geo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#1f1f27] rounded-xl overflow-hidden border border-gray-800 h-[400px] relative">
                        {/* Placeholder for Mapillary/StreetView */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="text-center p-6">
                                <p className="mb-4 text-gray-300">Mapillary Viewer Placeholder</p>
                                <p className="text-xs text-gray-500 font-mono break-all">Image ID: {geo.mapillary_image_id}</p>
                                <p className="text-xs text-gray-500 mt-2">Token: {geo.mapillary_token ? "Loaded" : "Missing"}</p>
                            </div>
                        </div>
                        {/* In production, initialize Mapillary JS here using geo.mapillary_image_id */}
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="bg-[#1f1f27] p-6 rounded-xl border border-gray-800 mb-6">
                            <h3 className="text-xl font-bold mb-4">Where are we?</h3>
                            {!revealed ? (
                                <AnimatedButton onClick={() => setRevealed(true)} className="w-full">
                                    Reveal Location
                                </AnimatedButton>
                            ) : (
                                <div className="space-y-2">
                                    <div className="text-[#FF1E00] font-bold text-xl">{geo.description}</div>
                                    <div className="text-gray-400 font-mono text-sm">
                                        Lat: {geo.lat}, Lon: {geo.lon}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-sm text-gray-500">
                            Identify the circuit or location based on the visual cues.
                            (Mapillary integration requires valid Client ID in .env)
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
