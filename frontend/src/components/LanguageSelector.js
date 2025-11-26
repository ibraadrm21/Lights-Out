import { React, html } from "/src/utils/htm.js";
import { useState, useEffect, useRef } from "react";

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState("en");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem("language") || "en";
        setCurrentLang(saved);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    const languages = [
        { code: "en", name: "English", countryCode: "gb" },
        { code: "es", name: "Español", countryCode: "es" },
        { code: "fr", name: "Français", countryCode: "fr" },
        { code: "de", name: "Deutsch", countryCode: "de" },
        { code: "it", name: "Italiano", countryCode: "it" },
        { code: "pt", name: "Português", countryCode: "pt" },
        { code: "nl", name: "Nederlands", countryCode: "nl" },
        { code: "ja", name: "日本語", countryCode: "jp" },
    ];

    function selectLanguage(code) {
        setCurrentLang(code);
        localStorage.setItem("language", code);
        setIsOpen(false);
        // Translation disabled - would require React i18n library
        console.log(`Language preference saved: ${code.toUpperCase()}`);
    }

    const current = languages.find(l => l.code === currentLang) || languages[0];

    return html`
    <div className="relative" ref=${dropdownRef}>
      <button 
        onClick=${() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/5 transition-colors text-sm font-medium"
      >
        <img 
          src=${`https://flagcdn.com/16x12/${current.countryCode}.png`}
          srcSet=${`https://flagcdn.com/32x24/${current.countryCode}.png 2x, https://flagcdn.com/48x36/${current.countryCode}.png 3x`}
          width="16"
          height="12"
          alt=${current.name}
          className="rounded-sm"
        />
        <span className="hidden md:inline">${current.code.toUpperCase()}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      ${isOpen && html`
        <div className="absolute right-0 mt-2 w-48 bg-[#0f0f14] border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          ${languages.map(lang => html`
            <button
              key=${lang.code}
              onClick=${() => selectLanguage(lang.code)}
              className=${`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left ${currentLang === lang.code ? 'bg-white/10' : ''}`}
            >
              <img 
                src=${`https://flagcdn.com/16x12/${lang.countryCode}.png`}
                srcSet=${`https://flagcdn.com/32x24/${lang.countryCode}.png 2x, https://flagcdn.com/48x36/${lang.countryCode}.png 3x`}
                width="16"
                height="12"
                alt=${lang.name}
                className="rounded-sm"
              />
              <span className="text-sm font-medium">${lang.name}</span>
              ${currentLang === lang.code && html`
                <svg className="w-4 h-4 ml-auto text-warmRed" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              `}
            </button>
          `)}
        </div>
      `}
    </div>
  `;
}
