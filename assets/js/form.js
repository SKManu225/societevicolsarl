/* =========================================================
   VICOL — Formulaire de contact
   Validation JS côté client + points d'intégration pour un
   service gratuit type Formspree ou EmailJS.

   -------------------------------------------------------------
   COMMENT BRANCHER LE FORMULAIRE (voir aussi le README) :

   OPTION A — Formspree (le plus simple) :
   1. Créez un compte gratuit sur https://formspree.io
   2. Récupérez votre "endpoint" (ex: https://formspree.io/f/xxxxxxx)
   3. Dans contact.html, remplacez l'attribut action="#" du
      formulaire par votre endpoint Formspree, et changez
      method="POST". Le JS ci-dessous détecte automatiquement
      une action différente de "#" et soumet via fetch().

   OPTION B — EmailJS :
   1. Créez un compte gratuit sur https://www.emailjs.com
   2. Ajoutez le script EmailJS CDN dans contact.html
   3. Remplacez la fonction submitForm() ci-dessous par un appel
      à emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
   ------------------------------------------------------------- */
(function () {
  "use strict";

  const form = document.querySelector("#contact-form");
  if (!form) return;

  const statusBox = document.querySelector(".form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  const validators = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => v.trim() === "" || /^[0-9+()\s.-]{8,}$/.test(v.trim()),
    subject: (v) => v.trim().length >= 2,
    message: (v) => v.trim().length >= 10,
  };

  const errorMessages = {
    name: "Merci d'indiquer votre nom (2 caractères minimum).",
    email: "Merci d'indiquer une adresse e-mail valide.",
    phone: "Merci d'indiquer un numéro de téléphone valide.",
    subject: "Merci d'indiquer un sujet.",
    message: "Votre message doit contenir au moins 10 caractères.",
  };

  function validateField(field) {
    const name = field.name;
    if (!validators[name]) return true;
    const valid = validators[name](field.value);
    const wrapper = field.closest(".field");
    if (!wrapper) return valid;
    wrapper.classList.toggle("has-error", !valid);
    const errorEl = wrapper.querySelector(".error-msg");
    if (errorEl) errorEl.textContent = errorMessages[name] || "Champ invalide.";
    return valid;
  }

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".field")?.classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  function showStatus(type, message) {
    if (!statusBox) return;
    statusBox.textContent = message;
    statusBox.className = "form-status is-visible " + type;
  }

  async function submitForm(e) {
    e.preventDefault();

    const fields = Array.from(form.querySelectorAll("input[name], textarea[name]"));
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      showStatus("error", "Merci de corriger les champs indiqués en rouge.");
      return;
    }

    const action = form.getAttribute("action");
    const isConfigured = action && action !== "#" && action.trim() !== "";

    if (!isConfigured) {
      /* Aucun service tiers branché : on informe l'utilisateur
         plutôt que de simuler un faux succès. Voir instructions
         en haut de ce fichier pour brancher Formspree/EmailJS. */
      showStatus(
        "error",
        "Le formulaire n'est pas encore connecté à un service d'envoi. " +
        "En attendant, contactez-nous directement par téléphone, e-mail ou WhatsApp ci-contre."
      );
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours…";

    try {
      const response = await fetch(action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        showStatus("success", "Votre message a bien été envoyé. Nous vous répondrons rapidement.");
        form.reset();
      } else {
        showStatus("error", "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous contacter par téléphone.");
      }
    } catch (err) {
      showStatus("error", "Une erreur réseau est survenue. Merci de réessayer ou de nous contacter par téléphone.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Envoyer le message";
    }
  }

  form.addEventListener("submit", submitForm);
})();
