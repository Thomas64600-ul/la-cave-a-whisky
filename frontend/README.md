# Frontend – La Cave à Whisky 

Ce dossier contient la partie **interface utilisateur** du projet.

## Structure

frontend/
│
├── index.html
├── cave.html
├── details.html
├── add-whisky.html
├── tasting.html
├── login.html
├── register.html
│
├── components/
│   ├── header/
│   │   ├── header.html
│   │   └── header.css
│   ├── footer/
│   │   ├── footer.html
│   │   └── footer.css
│   ├── whisky-card/
│   │   ├── whisky-card.html
│   │   └── whisky-card.css
│   ├── tasting-card/
│   │   ├── tasting-card.html
│   │   └── tasting-card.css
│
├── assets/
│   ├── css/
│   │   ├── style.css         ← CSS global (layout, variables, thèmes)
│   │   └── forms.css         ← CSS des formulaires si besoin
│   ├── images/
│   │   ├── logo.png
│   │   └── default.jpg
│
├── js/
│   ├── main.js               ← charge les composants + gère le thème
│   ├── api.js                ← fonctions pour l’API Whisky Edition
│   ├── cave.js               ← affichage des whiskys de Bon Papa
│   ├── tasting.js            ← gestion des dégustations
│   ├── auth.js               ← login / register
│   └── utils/
│       └── loadComponent.js  ← fonction utilitaire pour charger les composants
│
└── README.md



## Technologies
- HTML5
- CSS3 (Grid / Flexbox)
- JavaScript ES Modules
- Mode clair / sombre
- API Whisky Edition + Backend Bon Papa

Auteur

Thomas de Traversay
Développeur Web & Web Mobile
Projet réalisé dans le cadre du titre professionnel DWWM

Contact : thomasdetraversay@gmail.com
