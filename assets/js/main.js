/* =========================================================
   VICOL — Script principal
   Initialisation générale : année du footer, accordéon FAQ.
   Les autres modules (navigation, animations, gallery, form,
   i18n) s'auto-initialisent dans leurs propres fichiers.
   ========================================================= */
(function () {
  "use strict";

  /* --- Année dynamique dans le footer --- */
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Accordéon FAQ (accessible clavier / ARIA) --- */
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach((trigger) => {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    if (!panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      /* Ferme les autres items du même groupe (accordéon exclusif) */
      const group = trigger.closest(".accordion");
      if (group) {
        group.querySelectorAll(".accordion-trigger").forEach((t) => {
          if (t !== trigger) {
            t.setAttribute("aria-expanded", "false");
            const p = document.getElementById(t.getAttribute("aria-controls"));
            if (p) p.style.height = "0px";
          }
        });
      }

      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.height = isOpen ? "0px" : panel.scrollHeight + "px";
    });
  });
})();
