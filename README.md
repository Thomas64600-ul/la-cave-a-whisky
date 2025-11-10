# La Cave à Whisky de Bon Papa

## Présentation du projet
**La Cave à Whisky de Bon Papa** est une application web permettant de gérer une collection de whiskys et de partager des avis de dégustation entre amateurs.

Ce projet a été conçu comme un **projet de fin de formation** dans le cadre du titre professionnel **Développeur Web & Web Mobile**.

> Il illustre la mise en œuvre complète d’un projet web avec une architecture **frontend + backend**, une base de données **NoSQL (MongoDB)**, et une interface claire et élégante.

---

## Technologies utilisées

| Côté | Technologies principales |
|------|----------------------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Authentification** | JWT, bcrypt |
| **Outils et sécurité** | dotenv, cors, helmet, morgan |
| **Gestion des médias** | Cloudinary |
| **Versionnement** | Git, GitHub |

---

## Structure du projet

la-cave-a-whisky/
│
├── backend/ # API Node.js (Express + MongoDB)
│ ├── app.js
│ ├── config/
│ ├── models/
│ ├── controllers/
│ ├── routes/
│ └── ...
│
├── frontend/ # Interface utilisateur (HTML / CSS / JS)
│ ├── index.html
│ ├── css/
│ └── js/
│
└── README.md # Présentation globale du projet


---

## Installation et lancement du projet

### Cloner le dépôt
```bash
git clone https://github.com/Thomas64600-ul/la-cave-a-whisky.git
cd la-cave-a-whisky

Lancer le backend

cd backend
npm install
node app.js

Le serveur démarre sur http://localhost:5000

Lancer le frontend

Pour l’instant, le frontend est en développement.
Il sera accessible via le dossier /frontend.

Fonctionnalités prévues

Gestion des whiskys (CRUD complet)

Authentification et rôles utilisateur

Ajout et gestion des dégustations / avis

Upload d’images sur Cloudinary

Tableau de bord administrateur

Design responsive clair / sombre

Auteur

Thomas de Traversay
Développeur Web & Web Mobile
Contact: thomasdetraversay@gmail.com