// Translation service for AI-powered page translation with preloading
import api from "/src/utils/api.js";

const translationCache = new Map();
const originalTexts = [];
let isPreloading = false;
let preloadComplete = false;

const SUPPORTED_LANGUAGES = ["es", "fr", "de", "it", "pt", "nl", "ja"];

// Preload all translations on page load
export async function preloadTranslations() {
    if (isPreloading || preloadComplete) return;

    isPreloading = true;
    console.log("🌍 Preloading translations...");

    // Collect all text nodes
    const textNodes = collectTextNodes(document.body);
    const textsToTranslate = textNodes.map(node => node.textContent.trim()).filter(t => t.length > 0);

    if (textsToTranslate.length === 0) {
        isPreloading = false;
        return;
    }

    // Store original texts globally
    originalTexts.length = 0;
    originalTexts.push(...textsToTranslate);

    // Preload translations for all languages in parallel
    const promises = SUPPORTED_LANGUAGES.map(async (lang) => {
        try {
            const response = await api.post("/api/translate", {
                texts: textsToTranslate,
                target_lang: lang,
                source_lang: "en"
            });

            if (response.translations) {
                translationCache.set(lang, response.translations);
                console.log(`✅ Preloaded ${lang.toUpperCase()}`);
            }
        } catch (error) {
            console.error(`❌ Failed to preload ${lang}:`, error);
        }
    });

    await Promise.all(promises);
    preloadComplete = true;
    isPreloading = false;
    console.log("🎉 All translations preloaded!");
}

export async function translatePage(targetLang) {
    if (targetLang === "en") {
        // Restore original English content
        restoreOriginalContent();
        console.log("✅ Restored to English");
        return;
    }

    // Check if we have cached translations
    if (translationCache.has(targetLang)) {
        console.log(`⚡ Using cached translation for ${targetLang.toUpperCase()}`);
        const textNodes = collectTextNodes(document.body);
        const cached = translationCache.get(targetLang);
        console.log(`📝 Found ${textNodes.length} text nodes, ${cached.length} translations`);
        applyTranslations(textNodes, cached);
        console.log(`✅ Applied ${targetLang.toUpperCase()} translation`);
        return;
    }

    // If not cached, fetch it now
    console.log(`🔄 Fetching translation for ${targetLang.toUpperCase()}...`);
    const textNodes = collectTextNodes(document.body);
    const textsToTranslate = textNodes.map(node => node.textContent.trim()).filter(t => t.length > 0);

    console.log(`📝 Collected ${textsToTranslate.length} texts to translate`);
    console.log(`📄 First few texts:`, textsToTranslate.slice(0, 5));

    if (textsToTranslate.length === 0) return;

    try {
        const response = await api.post("/api/translate", {
            texts: textsToTranslate,
            target_lang: targetLang,
            source_lang: "en"
        });

        console.log(`📥 Received response:`, response);

        if (response.translations) {
            console.log(`✅ Got ${response.translations.length} translations`);
            console.log(`📄 First few translations:`, response.translations.slice(0, 5));
            translationCache.set(targetLang, response.translations);
            applyTranslations(textNodes, response.translations);
            console.log(`✅ Applied ${targetLang.toUpperCase()} translation`);
        } else {
            console.error("❌ No translations in response");
        }
    } catch (error) {
        console.error("❌ Translation failed:", error);
    }
}

function collectTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                // Skip script, style, and empty nodes
                if (node.parentElement.tagName === "SCRIPT" ||
                    node.parentElement.tagName === "STYLE" ||
                    !node.textContent.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
        // Store original content
        if (!node._originalContent) {
            node._originalContent = node.textContent;
        }
    }

    return textNodes;
}

function applyTranslations(textNodes, translations) {
    let appliedCount = 0;
    textNodes.forEach((node, index) => {
        if (translations[index] && translations[index] !== node.textContent) {
            const before = node.textContent;
            node.textContent = translations[index];
            if (index < 5) {  // Only log first 5 to avoid spam
                console.log(`🔄 [${index}] "${before}" → "${translations[index]}"`);
            }
            appliedCount++;
        }
    });
    console.log(`✅ Applied ${appliedCount} translations out of ${textNodes.length} nodes`);
}

function restoreOriginalContent() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
    );

    let node;
    while (node = walker.nextNode()) {
        if (node._originalContent) {
            node.textContent = node._originalContent;
        }
    }
}

export default { translatePage, preloadTranslations };
