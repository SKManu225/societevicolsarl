/* =========================================================
   VICOL — Internationalisation (FR / EN)
   Charge lang/fr.json et lang/en.json, applique les
   traductions à tout élément portant data-i18n="cle.imbriquee".
   La langue choisie est mémorisée en mémoire pour la session
   (aucun stockage navigateur requis).

   -------------------------------------------------------------
   NOTE POUR L'ÉQUIPE VICOL :
   Le socle FR/EN est fonctionnel pour toute l'interface commune
   (menu, footer, boutons, formulaire, bouton WhatsApp). Le
   contenu éditorial complet des pages intérieures (À propos,
   Services, Réalisations...) est fourni en français, la langue
   principale du marché ivoirien. Pour traduire un bloc de texte
   supplémentaire :
     1. Ajoutez l'attribut data-i18n="ma.cle" sur l'élément HTML
     2. Ajoutez la clé "ma": { "cle": "Texte français" } dans
        lang/fr.json et son équivalent dans lang/en.json
   ------------------------------------------------------------- */
(function () {
  "use strict";

  const STORAGE_KEY = "vicol-lang";
  let currentLang = "fr";
  let dictionaries = {};

  function getNested(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }

  function applyTranslations(lang) {
    const dict = dictionaries[lang];
    if (!dict) return;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNested(dict, key);
      if (value === null) return;

      const attr = el.getAttribute("data-i18n-attr");
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    });

    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll(".lang-switch button, .mobile-nav__lang button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });

    currentLang = lang;
    try { sessionStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* stockage indisponible, on ignore */ }
  }

  async function loadDictionary(lang) {
    if (dictionaries[lang]) return dictionaries[lang];
    const base = document.documentElement.getAttribute("data-base-path") || "";
    const response = await fetch(`${base}lang/${lang}.json`);
    if (!response.ok) throw new Error("Impossible de charger la langue " + lang);
    const data = await response.json();
    dictionaries[lang] = data;
    return data;
  }

  async function setLanguage(lang) {
    try {
      await loadDictionary(lang);
      applyTranslations(lang);
    } catch (err) {
      console.warn("i18n:", err.message);
    }
  }

  function initLangSwitchers() {
    document.querySelectorAll(".lang-switch button, .mobile-nav__lang button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang && lang !== currentLang) setLanguage(lang);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    let initial = "fr";
    try {
      initial = sessionStorage.getItem(STORAGE_KEY) || "fr";
    } catch (e) { /* ignore */ }
    initLangSwitchers();
    setLanguage(initial);
  });
})();
