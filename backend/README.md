# La Cave à Whisky de Bon Papa - Backend

## Description du projet
**La Cave à Whisky de Bon Papa** est une application web permettant de gérer une collection de whiskys.  
Chaque utilisateur peut consulter les bouteilles disponibles, laisser une note de dégustation, et pour l’administrateur, gérer la base complète (CRUD).

Ce dépôt contient **le backend** du projet, développé avec :
- **Node.js** et **Express** pour la logique serveur
- **MongoDB** et **Mongoose** pour la base de données NoSQL
- **JWT** pour l’authentification sécurisée
- **Cloudinary** pour la gestion des images

> Objectif : concevoir un projet complet, documenté et prêt à être présenté lors de l’évaluation finale du titre professionnel “Développeur Web & Web Mobile”.

---

## Technologies utilisées

| Catégorie | Outils / Librairies |
|------------|---------------------|
| **Serveur** | Node.js, Express |
| **Base de données** | MongoDB, Mongoose |
| **Authentification** | bcrypt, JSON Web Token |
| **Sécurité** | dotenv, helmet, cors |
| **Autres** | Cloudinary, Morgan (logs) |

---

## Structure du projet
backend/
│
├── app.js # Point d'entrée de l'application
├── config/
│ └── db.js # Connexion à MongoDB
├── models/ # Schémas Mongoose (Whisky, User, Tasting)
├── controllers/ # Logique métier
├── routes/ # Routes API
├── middlewares/ # Authentification, upload, etc.
├── .env # Variables d'environnement (non versionné)
└── package.json


---

## Installation et lancement du projet

### Cloner le dépôt
```bash
git clone https://github.com/tonpseudo/la-cave-a-whisky-backend.git
cd la-cave-a-whisky-backend

Installer les dépendances
npm install

Créer le fichier .env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cavewhisky
JWT_SECRET=ton_secret_jwt
CLOUDINARY_URL=ton_url_cloudinary

Lancer le serveur
node app.js
Le serveur démarre sur http://localhost:5000

API (exemples de routes)
| Méthode    | Endpoint             | Description                      |
| ---------- | -------------------- | -------------------------------- |
| **GET**    | `/api/whiskies`      | Liste tous les whiskys           |
| **POST**   | `/api/whiskies`      | Ajoute un nouveau whisky (admin) |
| **PUT**    | `/api/whiskies/:id`  | Met à jour un whisky             |
| **DELETE** | `/api/whiskies/:id`  | Supprime un whisky               |
| **POST**   | `/api/auth/register` | Crée un compte utilisateur       |
| **POST**   | `/api/auth/login`    | Connecte un utilisateur          |
| **POST**   | `/api/tastings`      | Ajoute un avis sur un whisky     |

Sécurité & bonnes pratiques
Variables sensibles gérées avec dotenv

Requêtes cross-domain autorisées via CORS

Mots de passe hashés avec bcrypt

Authentification sécurisée par JWT

Upload d’images sécurisé via Cloudinary

Exemple d'architecture de données (MongoDB)
Whisky = {
  name: "Lagavulin 16",
  origin: "Écosse",
  degree: 43,
  description: "Un single malt tourbé et équilibré.",
  imageUrl: "https://cloudinary.com/lagavulin16.jpg",
  createdAt: Date
}

Auteur

Thomas de Traversay
Développeur Web & Web Mobile
Projet réalisé dans le cadre du titre professionnel DWWM

Contact : thomasdetraversay@gmail.com



