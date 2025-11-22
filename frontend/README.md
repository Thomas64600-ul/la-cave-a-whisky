#  La Cave à Whisky – Backend API

Backend Node.js / Express / MongoDB pour l’application **La Cave à Whisky** :  
- **Catalogue mondial** de whiskys (import JSON, API globale)  
- **Cave privée de Bon Papa** (stock + notes)  
- **Dégustations** (notes et commentaires des utilisateurs)  
- Gestion des **utilisateurs**, des **rôles** (`user`, `admin`) et de l’authentification JWT  
- Upload d’images via **Cloudinary**

---

## Stack technique

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (authentification)
- **Cloudinary** (upload d’images)
- **Joi** (validation des données)
- **Multer** (gestion des fichiers)
- Middlewares maison : `authMiddleware`, `authorizeRoles`, `validationMiddleware`, `errorHandler`, `rateLimiter`, `uploadMiddleware`

---

## Pré-requis

- Node.js 18+  
- npm ou yarn  
- Un compte **MongoDB Atlas** ou une instance MongoDB locale  
- Un compte **Cloudinary** (pour les images)  

---

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/ton-compte/la-cave-a-whisky.git
cd la-cave-a-whisky/backend

Installer les dépendances :

npm install
# ou
yarn install

Structure des dossiers (backend)
backend/
│
├── app.js                     # Point d’entrée de l’API
├── package.json
├── .env
│
├── config/
│   ├── db.js                  # Connexion MongoDB
│   └── cloudinary.js          # Config Cloudinary
│
├── controllers/
│   ├── authController.js      # Login / Register / Me
│   ├── userController.js      # Gestion des utilisateurs
│   ├── catalogueController.js # Catalogue mondial
│   ├── whiskyController.js    # Whiskys locaux + cave
│   └── tastingController.js   # Dégustations
│
├── data/
│   └── whiskies.json          # Catalogue mondial (Option C)
│
├── middlewares/
│   ├── authMiddleware.js      # protect (JWT)
│   ├── authorizeRoles.js      # restrict to roles
│   ├── errorHandler.js        # gestion des erreurs globales
│   ├── rateLimiter.js         # limiteur de requêtes
│   ├── uploadMiddleware.js    # multer + Cloudinary
│   └── validationMiddleware.js# validation Joi
│
├── models/
│   ├── User.js                # Utilisateur (user/admin)
│   ├── CatalogueWhisky.js     # Whisky du catalogue mondial
│   ├── Whisky.js              # Whisky local + cave de Bon Papa
│   └── Tasting.js             # Dégustation
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── catalogueRoutes.js
│   ├── whiskyRoutes.js
│   └── tastingRoutes.js
│
└── schemas/
    ├── userSchema.js
    ├── catalogueWhiskySchema.js
    ├── whiskySchema.js
    └── tastingSchema.js
Scripts npm

Dans le dossier backend :
# Lancer en mode développement
npm run dev

# Lancer en mode production (avec build ou transpile si nécessaire)
npm start

# (Optionnel) Lancer des tests
npm test

Par défaut, l’API écoute sur :
http://localhost:5000/api

Authentification & Rôles

Inscription (/auth/register) → crée un user avec rôle user par défaut

Connexion (/auth/login) → renvoie un JWT

Rôles :

user → peut consulter le catalogue, ajouter des dégustations, proposer des whiskys au catalogue

admin (Bon Papa) → gère la cave, les whiskys locaux, le catalogue, les dégustations

Les routes protégées utilisent :

protect → vérifie la présence d’un JWT valide

authorizeRoles("admin") → restreint aux admins

authorizeRoles("user", "admin") → user + admin

Exemple de header Authorization :
Authorization: Bearer <JWT>

Catalogue mondial (API interne)
Modèle : CatalogueWhisky

Champs principaux : name, brand, country, category, degree, year, description, image.

Endpoints :
| Méthode | Route               | Rôle         | Description                                 |
| ------- | ------------------- | ------------ | ------------------------------------------- |
| GET     | `/catalogue`        | Public       | Liste du catalogue mondial                  |
| GET     | `/catalogue/:id`    | Public       | Détail d’un whisky                          |
| POST    | `/catalogue`        | user + admin | Ajouter un whisky au catalogue              |
| PUT     | `/catalogue/:id`    | admin        | Modifier un whisky                          |
| DELETE  | `/catalogue/:id`    | admin        | Supprimer un whisky                         |
| POST    | `/catalogue/import` | admin        | Importer les whiskys depuis `whiskies.json` |

Exemple création (POST /catalogue) :
{
  "name": "Yamazaki 12",
  "brand": "Suntory",
  "country": "Japon",
  "category": "Single Malt",
  "degree": 43,
  "year": 12,
  "description": "Un classique japonais",
  "image": "https://..."
}

Whiskys locaux & Cave de Bon Papa
Modèle : Whisky

Champs principaux :

name, brand, country, category, degree, year, description, image

createdBy → référence User

Cave :

inCave: Boolean

bottleCount: Number

caveNotes: String

Endpoints whiskys locaux
| Méthode | Route           | Rôle   | Description                       |
| ------- | --------------- | ------ | --------------------------------- |
| GET     | `/whiskies`     | Public | Liste des whiskys locaux          |
| GET     | `/whiskies/:id` | Public | Détail d’un whisky local          |
| POST    | `/whiskies`     | admin  | Créer un whisky (upload image OK) |
| PUT     | `/whiskies/:id` | admin  | Mettre à jour un whisky           |
| DELETE  | `/whiskies/:id` | admin  | Supprimer un whisky               |

Endpoints cave de Bon Papa
| Méthode | Route                | Rôle  | Description                                     |
| ------- | -------------------- | ----- | ----------------------------------------------- |
| POST    | `/whiskies/cave/:id` | admin | Ajouter un whisky existant dans la cave         |
| PATCH   | `/whiskies/cave/:id` | admin | Modifier `bottleCount` / `caveNotes`            |
| DELETE  | `/whiskies/cave/:id` | admin | Retirer un whisky de la cave (`inCave = false`) |

Exemple : ajouter un whisky dans la cave (POST /whiskies/cave/:id) :
{
  "bottleCount": 3,
  "caveNotes": "À réserver pour les grandes occasions."
}

Dégustations (Tasting)
Modèle : Tasting

Champs :

user → ref User

whisky → ref Whisky

rating (1–5)

comment (optionnel)

Règles :

User + admin peuvent créer une dégustation

Un user ne peut noter un même whisky qu’une seule fois

Propriétaire ou admin peuvent modifier / supprimer

Endpoints dégustations
| Méthode | Route                        | Rôle        | Description                            |
| ------- | ---------------------------- | ----------- | -------------------------------------- |
| GET     | `/tastings`                  | admin       | Toutes les dégustations                |
| GET     | `/tastings/mine`             | user/admin  | Dégustations de l’utilisateur connecté |
| GET     | `/tastings/whisky/:whiskyId` | Public      | Dégustations pour un whisky            |
| GET     | `/tastings/:id`              | user/admin  | Détail d’une dégustation               |
| POST    | `/tastings`                  | user/admin  | Créer une dégustation                  |
| PUT     | `/tastings/:id`              | owner/admin | Mettre à jour une dégustation          |
| DELETE  | `/tastings/:id`              | owner/admin | Supprimer une dégustation              |

Exemple création (POST /tastings) :
{
  "whisky": "656f0b9f8a0b2b1ffa123456",
  "rating": 4,
  "comment": "Très belle longueur en bouche."
}

