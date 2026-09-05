/* =========================================================
   VICOL — Galerie réalisations
   Filtrage par catégorie + lightbox en JS natif.
   ========================================================= */
(function () {
  "use strict";

  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  const filterButtons = document.querySelectorAll(".filter-btn");
  const items = Array.from(grid.querySelectorAll(".gallery-item"));

  /* --- Filtres --- */
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.getAttribute("data-filter");

      items.forEach((item) => {
        const match = cat === "all" || item.getAttribute("data-category") === cat;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* --- Lightbox --- */
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  const lbImg = lightbox.querySelector("img");
  const lbCaption = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const prevBtn = lightbox.querySelector(".lightbox__nav.prev");
  const nextBtn = lightbox.querySelector(".lightbox__nav.next");
  let currentIndex = 0;
  let lastFocused = null;

  function getVisibleItems() {
    return items.filter((item) => !item.classList.contains("is-hidden"));
  }

  function openLightbox(index) {
    const visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = index;
    const item = visible[currentIndex];
    const img = item.querySelector("img");
    const title = item.querySelector("h4");
    lbImg.src = img.getAttribute("src");
    lbImg.alt = img.getAttribute("alt") || "";
    lbCaption.textContent = title ? title.textContent : "";
    lastFocused = document.activeElement;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function showRelative(delta) {
    const visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = (currentIndex + delta + visible.length) % visible.length;
    openLightbox(currentIndex);
  }

  items.forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    const activate = () => {
      const visible = getVisibleItems();
      openLightbox(visible.indexOf(item));
    };
    item.addEventListener("click", activate);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => showRelative(-1));
  nextBtn.addEventListener("click", () => showRelative(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showRelative(1);
    if (e.key === "ArrowLeft") showRelative(-1);
  });
})();
