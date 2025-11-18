API – La Cave à Whisky (Bon Papa) – Backend

Backend complet en Node.js / Express relié à MongoDB Atlas, permettant de gérer :

Un catalogue mondial de whiskies

La cave personnelle de Bon Papa

Les dégustations (notes/commentaires)

Un système d’authentification JWT sécurisé

Une gestion des utilisateurs (user/admin)

Upload Cloudinary pour les images

Cette API est utilisée par ton site La Cave à Whisky (frontend) afin de proposer :
Un catalogue de whiskies
Une cave personnelle
Des fiches de dégustation
Une interface utilisateur + administration

1. Technologies utilisées

| Domaine          | Technologie                          |
| ---------------- | ------------------------------------ |
| Runtime          | Node.js                              |
| Framework        | Express.js                           |
| Base de données  | MongoDB Atlas                        |
| ORM              | Mongoose                             |
| Authentification | JWT (JSON Web Token)                 |
| Sécurité         | Helmet, Rate limiter, Validation Joi |
| Upload           | Cloudinary + Multer (buffer)         |
| Logs             | Morgan                               |
| API REST         | Architecture professionnelle         |

2. Architecture du projet

backend/
│── app.js
│── config/
│     └── db.js
│── controllers/
│     ├── authController.js
│     ├── userController.js
│     ├── whiskyController.js
│     ├── tastingController.js
│     └── catalogueController.js
│── middlewares/
│     ├── authMiddleware.js
│     ├── authorizeRoles.js
│     ├── errorHandler.js
│     ├── validationMiddleware.js
│     ├── uploadMiddleware.js
│     └── rateLimiter.js
│── models/
│     ├── User.js
│     ├── Whisky.js
│     ├── CatalogueWhisky.js
│     └── Tasting.js
│── routes/
│     ├── authRoutes.js
│     ├── userRoutes.js
│     ├── whiskyRoutes.js
│     ├── tastingRoutes.js
│     └── catalogueRoutes.js
│── schemas/
│     ├── userSchema.js
│     ├── whiskySchema.js
│     ├── tastingSchema.js
│     └── catalogueWhiskySchema.js
└── data/
      └── whiskies.json

3. Authentification & Sécurité
JWT

Généré à chaque connexion/inscription :
{
  "userId": "...",
  "role": "user"
}
Les routes protégées nécessitent :
Authorization: Bearer <token>

Middlewares de sécurité intégrés

protect → vérifie et attache req.user

authorizeRoles("admin") → routes réservées aux admins

Joi Validation pour éviter les payloads invalides

Helmet → sécurité HTTP

Rate Limiter → anti-DDoS sur /auth

uploadMiddleware → gestion stricte des images

errorHandler global → format d’erreur propre

4. Gestion des utilisateurs (User + Admin)

| rôle  | permissions                                     |
| ----- | ----------------------------------------------- |
| user  | gérer son profil, avatar, dégustations          |
| admin | gérer tous les users + supprimer n'importe quoi |

Endpoints :

| Méthode | Route                   | Description           | Sécurité    |
| ------- | ----------------------- | --------------------- | ----------- |
| POST    | `/api/auth/register`    | Inscription           | Public      |
| POST    | `/api/auth/login`       | Connexion             | Public      |
| GET     | `/api/auth/check`       | Vérifier token        | JWT         |
| GET     | `/api/users/me`         | Profil connecté       | JWT         |
| GET     | `/api/users`            | Tous les utilisateurs | Admin       |
| GET     | `/api/users/:id`        | Détails user          | Owner/Admin |
| PUT     | `/api/users/:id`        | Modifier profil       | Owner       |
| PUT     | `/api/users/:id/avatar` | Modifier avatar       | Owner       |
| DELETE  | `/api/users/:id`        | Supprimer compte      | Admin       |

5. Catalogue mondial des whiskies

Base provenant :
du fichier whiskies.json (62 whiskies)
importée via :
POST /api/catalogue/import

Endpoints :

| Méthode | Route                | Description           |
| ------- | -------------------- | --------------------- |
| GET     | `/api/catalogue`     | Liste complète        |
| GET     | `/api/catalogue/:id` | Détails               |
| POST    | `/api/catalogue`     | Ajouter un whisky     |
| PUT     | `/api/catalogue/:id` | Modifier              |
| DELETE  | `/api/catalogue/:id` | Supprimer             |

6. Cave personnelle de Bon Papa

Chaque whisky du catalogue peut être ajouté à la cave.

Endpoints :

| Méthode | Route                    | Description         |
| ------- | ------------------------ | ------------------- |
| POST    | `/api/whiskies/cave/:id` | Ajouter à la cave   |
| PATCH   | `/api/whiskies/cave/:id` | Modifier infos cave |
| DELETE  | `/api/whiskies/cave/:id` | Retirer de la cave  |

7. Gestion des dégustations (Tasting)

Un utilisateur peut :
noter un whisky
commenter
modifier sa dégustation
supprimer sa dégustation
pas noter plusieurs fois le même whisky

Endpoints :

| Méthode | Route                | Description             | Sécurité    |
| ------- | -------------------- | ----------------------- | ----------- |
| GET     | `/api/tastings`      | Toutes les dégustations | Public      |
| GET     | `/api/tastings/mine` | Mes dégustations        | JWT         |
| GET     | `/api/tastings/:id`  | Détails                 | Public      |
| POST    | `/api/tastings`      | Ajouter                 | JWT         |
| PUT     | `/api/tastings/:id`  | Modifier                | Owner/Admin |
| DELETE  | `/api/tastings/:id`  | Supprimer               | Owner/Admin |

8. Gestion des whiskies (API interne)

Whiskies créés manuellement dans la cave (pas catalogue mondial).

Endpoints :

| Méthode | Route               | Description                  | Sécurité |
| ------- | ------------------- | ---------------------------- | -------- |
| GET     | `/api/whiskies`     | Tous les whiskies de la cave |          |
| GET     | `/api/whiskies/:id` | Détails whisky               |          |
| POST    | `/api/whiskies`     | Ajouter un whisky            | Admin    |
| PUT     | `/api/whiskies/:id` | Modifier                     | Admin    |
| DELETE  | `/api/whiskies/:id` | Supprimer                    | Admin    |

9. Upload des images (Cloudinary)
Utilisation :

whisky image

avatar utilisateur

→ via Multer (buffer) + upload_stream Cloudinary

Sécurisé :

formats autorisés : jpg/jpeg/png/webp

taille max : 10 Mo

transformation : resize → width 1000

0. Middlewares essentiels
protect

vérifie le token

charge req.user

renvoie 401 si token invalide

authorizeRoles

bloque la route si rôle non autorisé

validate(schema)

validation Joi stricte

renvoie la liste des erreurs

protège l’API de tout payload non conforme

uploadMiddleware

Multer memoryStorage

fileFilter sécurisé

rateLimiter

global limiter = 100 req / 15 min

auth limiter = 5 tentatives / 5 min

errorHandler

gère tous les cas

friendly message

stack en dev

ID d’erreur en prod

11. Base de données : MongoDB Atlas

Modèles :

User

username

email

password (hashé)

role

avatar

isActive

timestamps

CatalogueWhisky

→ whisky mondial

Whisky

→ whisky dans la cave

Tasting

→ note/commentaire

12. Lancer le projet
Installation
npm install

Variables d’environnement :

Créer .env :
PORT=5000
MONGO_URI=""
JWT_SECRET=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NODE_ENV=development

Lancer le backend
npm run dev

13. Conclusion

Ce backend :

est modulaire

sécurisé

optimisé

structuré pour grandir