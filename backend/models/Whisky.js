import mongoose from "mongoose";


const whiskySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du whisky est obligatoire"],
      trim: true,
    },
    origin: {
      type: String,
      required: [true, "L'origine est obligatoire"],
      trim: true,
    },
    degree: {
      type: Number,
      required: [true, "Le degré d'alcool est obligatoire"],
      min: [0, "Le degré ne peut pas être négatif"],
      max: [100, "Le degré ne peut pas dépasser 100"],
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, 
  }
);


const Whisky = mongoose.model("Whisky", whiskySchema);

export default Whisky;
