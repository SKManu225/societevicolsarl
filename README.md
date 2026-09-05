# Site web Vicol SARL — Guide d'utilisation

Ce dossier contient le site web complet de **Vicol — Vitrinemarket Company Limited SARL**, prêt à être testé, personnalisé puis déployé gratuitement.

---

## 1. Structure du projet

```
vicol-site/
├── index.html              → Page d'accueil
├── a-propos.html           → Page À propos
├── services.html           → Page Services
├── realisations.html       → Page Réalisations (galerie filtrable)
├── faq.html                → Page FAQ (accordéon)
├── contact.html            → Page Contact (formulaire + carte)
├── mentions-legales.html   → Mentions légales
├── 404.html                → Page d'erreur personnalisée
├── robots.txt               → Indexation SEO
├── sitemap.xml               → Plan du site pour les moteurs de recherche
├── CNAME                     → Domaine personnalisé (GitHub Pages)
├── _headers                  → En-têtes de sécurité (Cloudflare Pages)
├── assets/
│   ├── css/                  → Feuilles de style (variables, base, composants, layout, animations, responsive)
│   ├── js/                   → Scripts (navigation, animations, galerie, formulaire, traduction, script principal)
│   └── images/                → Logos, visuels hero, services, réalisations
└── lang/
    ├── fr.json                → Traductions françaises (interface commune)
    └── en.json                → Traductions anglaises (interface commune)
```

---

## 2. Tester le site en local

Aucune installation n'est requise, mais le site doit être servi par un petit serveur local (pas ouvert directement en double-cliquant sur le fichier, pour que le chargement du menu et des traductions fonctionne correctement).

**Avec Python (déjà installé sur Mac/Linux) :**
```bash
cd vicol-site
python3 -m http.server 8000
```
Puis ouvrez `http://localhost:8000` dans votre navigateur.

**Avec l'extension "Live Server" de VS Code :** clic droit sur `index.html` → "Open with Live Server".

---

## 3. Remplacer les contenus à compléter

Le site est **entièrement fonctionnel dès maintenant**, avec des visuels placeholder élégants (motifs géométriques dans les couleurs de la marque) en attendant vos vraies photos.

### Photos de réalisations
Dans `realisations.html` et sur la page d'accueil, remplacez :
```
assets/images/realisations/realisation-01.svg
```
par vos vraies photos (formats recommandés : `.jpg` ou `.webp`), en conservant le même nom de fichier ou en mettant à jour le chemin dans le HTML. Recherchez les commentaires `<!-- Projet à renseigner -->` pour localiser chaque emplacement, et remplacez aussi le titre "Projet à renseigner" par le vrai nom du projet.

### Témoignages clients
Recherchez le commentaire suivant dans `index.html` :
```html
<!-- Remplacer par de vrais témoignages clients dès qu'ils seront disponibles -->
```
Dupliquez le bloc `.testimonial-card` pour chaque témoignage réel, avec le nom du client et son entreprise.

### Photo du siège / équipe
Remplacez `assets/images/equipe/siege-vicol.svg` par une vraie photo du siège ou de l'équipe (utilisée sur la page d'accueil et la page À propos).

### Image d'arrière-plan du hero
Remplacez `assets/images/hero/hero-accueil.svg` par une photo grand format (1920×1080 recommandé) illustrant un chantier, un terrain aménagé ou un bien immobilier Vicol.

---

## 4. Brancher le formulaire de contact

Le site étant 100% statique (sans serveur), le formulaire de `contact.html` a besoin d'un service tiers **gratuit** pour envoyer réellement les messages par e-mail.

### Option A — Formspree (recommandé, le plus simple)
1. Créez un compte gratuit sur [formspree.io](https://formspree.io)
2. Créez un nouveau formulaire, vous obtenez une URL du type `https://formspree.io/f/xxxxxxx`
3. Dans `contact.html`, repérez la balise `<form id="contact-form" action="#" method="POST">` et remplacez `action="#"` par votre URL Formspree
4. C'est tout : `assets/js/form.js` détecte automatiquement l'URL configurée et envoie les messages via cette API

### Option B — EmailJS
1. Créez un compte gratuit sur [emailjs.com](https://www.emailjs.com)
2. Ajoutez leur script dans le `<head>` de `contact.html`
3. Adaptez la fonction `submitForm()` dans `assets/js/form.js` pour utiliser `emailjs.sendForm(...)` (voir la documentation EmailJS)

Tant que le formulaire n'est pas connecté, un message invite poliment le visiteur à vous contacter par téléphone, e-mail ou WhatsApp — aucun faux message de succès n'est affiché.

---

## 5. Déployer gratuitement le site

### Option A — GitHub Pages (recommandé si vous connaissez Git)
1. Créez un compte sur [github.com](https://github.com) si besoin
2. Créez un nouveau dépôt (par exemple `vicol-site`)
3. Importez tous les fichiers de ce dossier dans le dépôt (via l'interface web "Add file → Upload files", ou via Git en ligne de commande)
4. Dans le dépôt : **Settings → Pages → Source : "Deploy from a branch"**, choisissez la branche `main` et le dossier `/ (root)`
5. Le fichier `CNAME` déjà présent dans le projet indique à GitHub Pages d'utiliser `www.vitrinemarket.org`
6. Configurez ensuite votre domaine chez votre registrar (voir étape 6 ci-dessous)

### Option B — Cloudflare Pages (recommandé pour la rapidité et la sécurité)
1. Créez un compte gratuit sur [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connectez votre dépôt GitHub (ou uploadez directement le dossier via "Direct Upload")
3. Laissez les paramètres de build vides (site 100% statique, aucune commande de build nécessaire)
4. Une fois déployé, allez dans **Custom domains** et ajoutez `www.vitrinemarket.org`
5. Le fichier `_headers` déjà présent applique automatiquement des en-têtes de sécurité de base

---

## 6. Configurer le domaine `vitrinemarket.org`

Chez votre registrar de domaine (là où vous avez acheté le `.org`), configurez les enregistrements DNS suivants :

**Pour GitHub Pages :**
| Type  | Nom | Valeur |
|-------|-----|--------|
| A     | @   | 185.199.108.153 |
| A     | @   | 185.199.109.153 |
| A     | @   | 185.199.110.153 |
| A     | @   | 185.199.111.153 |
| CNAME | www | *votre-compte*.github.io |

**Pour Cloudflare Pages :**
| Type  | Nom | Valeur |
|-------|-----|--------|
| CNAME | www | *votre-projet*.pages.dev |

La propagation DNS peut prendre de quelques minutes à 24-48h. Le certificat HTTPS est généré automatiquement par les deux plateformes.

---

## 7. Bascule de langue FR / EN

L'interface commune (menu, boutons, footer, formulaire) est déjà traduite en français et en anglais via `lang/fr.json` et `lang/en.json`. Le contenu éditorial complet des pages (À propos, Services, Réalisations...) est fourni en français, langue principale du marché ivoirien.

Pour traduire un bloc de texte supplémentaire :
1. Ajoutez l'attribut `data-i18n="ma.cle"` sur l'élément HTML concerné
2. Ajoutez la clé correspondante dans `lang/fr.json` et son équivalent dans `lang/en.json`

---

## 8. Bonnes pratiques déjà intégrées

- **SEO** : balises title/description uniques par page, sitemap.xml, robots.txt, données structurées Schema.org, balises Open Graph
- **Accessibilité** : navigation clavier, focus visibles, textes alternatifs, ARIA sur le menu mobile/l'accordéon/la galerie, respect de `prefers-reduced-motion`
- **Performance** : CSS/JS légers sans dépendance externe lourde, chargement différé des images (`loading="lazy"`), polices avec `font-display: swap`
- **Sécurité** : liens externes en `rel="noopener noreferrer"`, en-têtes de sécurité via `_headers` (Cloudflare)
- **Responsive** : mobile-first, testé de 360px à grand écran

---

## Besoin d'aide ?
Pour toute question sur la structure du code ou son déploiement, vous pouvez revenir vers l'assistant IA qui a généré ce site avec ce même projet en contexte.
