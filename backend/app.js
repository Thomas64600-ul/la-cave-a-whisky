import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import { connectDB } from "./config/db.js"; 
import { errorHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import whiskyRoutes from "./routes/whiskyRoutes.js";
import tastingRoutes from "./routes/tastingRoutes.js";

dotenv.config();
const app = express();

await connectDB();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://reveren.netlify.app", 
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS non autorisé pour cette origine"));
      }
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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `La ressource demandée (${req.originalUrl}) est introuvable.`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
  console.log(`Mode : ${process.env.NODE_ENV || "development"}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Rejection non gérée :", err);
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("Fermeture du serveur...");
  await mongoose.connection.close();
  console.log("Connexion MongoDB fermée proprement");
  process.exit(0);
});

