import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI manquant dans le fichier .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true, 
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
      family: 4, 
    });

    console.log(`MongoDB connecté : ${mongoose.connection.name}`);
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error.message);
    process.exit(1);
  }

  mongoose.connection.on("connected", () => {
    console.log("Connexion à MongoDB établie");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Erreur MongoDB :", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("Déconnecté de MongoDB, tentative de reconnexion...");
    setTimeout(connectDB, 5000);
  });
}
