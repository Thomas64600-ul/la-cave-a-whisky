import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import mongoose from "mongoose";


import { errorHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

import userRoutes from "./routes/userRoutes.js";
import whiskyRoutes from "./routes/whiskyRoutes.js";
import tastingRoutes from "./routes/tastingRoutes.js";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté avec succès"))
  .catch((err) => {
    console.error("Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  });

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(cors({ origin: true, credentials: true })); 
app.use(helmet()); 
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json()); 
app.use(cookieParser());
app.use(compression()); 
app.use(generalLimiter); 

app.use("/api/users", userRoutes);
app.use("/api/whiskies", whiskyRoutes);
app.use("/api/tastings", tastingRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `La ressource demandée (${req.originalUrl}) est introuvable.`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT} (${process.env.NODE_ENV})`);
});

