import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connexion MongoDB réussie !");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error.message);
    process.exit(1); 
  }
}
