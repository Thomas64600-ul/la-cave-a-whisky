import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import whiskyRoutes from "./routes/whiskyRoutes.js";
import tastingRoutes from "./routes/tastingRoutes.js";
import catalogueRoutes from "./routes/catalogueRoutes.js";

dotenv.config();

const app = express();

const HOST = "127.0.0.1";
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5501",
  "http://127.0.0.1:5501"
];

      if (!origin) return callback(null, true);

      if (allowed.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS non autorisé : " + origin));
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(generalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/whiskies", whiskyRoutes);
app.use("/api/tastings", tastingRoutes);
app.use("/api/catalogue", catalogueRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `La ressource demandée (${req.originalUrl}) est introuvable.`,
  });
});

app.use(errorHandler);

connectDB()
  .then(() => {
    console.log("MongoDB connecté");

    app.listen(PORT, HOST, () => {
      console.log(`Serveur en ligne sur http://${HOST}:${PORT}`);
      console.log(`Mode : ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB :", err);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  console.log("Fermeture du serveur...");
  await mongoose.connection.close();
  console.log("Connexion MongoDB fermée proprement");
  process.exit(0);
});

