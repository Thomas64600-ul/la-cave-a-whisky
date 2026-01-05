import mongoose from "mongoose";

const whiskySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du whisky est obligatoire"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "La marque du whisky est obligatoire"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Le pays d'origine est obligatoire"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "La catégorie est obligatoire"],
      trim: true,
    },
    degree: {
      type: Number,
      required: [true, "Le degré d'alcool est obligatoire"],
      min: [0, "Le degré ne peut pas être négatif"],
      max: [100, "Le degré ne peut pas dépasser 100"],
    },

    age: {
      type: Number,
      default: null,
      min: [0, "L'âge ne peut pas être négatif"],
      max: [100, "L'âge ne peut pas dépasser 100"],
    },

    price: {
      type: Number,
      required: [true, "Le prix est obligatoire"],
      min: [0, "Le prix ne peut pas être négatif"],
    },

    purchasePlace: {
      type: String,
      required: [true, "Le lieu d'achat est obligatoire"],
      trim: true,
    },


    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1700000000/default-whisky.png",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    inCave: {
      type: Boolean,
      default: false,
    },

    bottleCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    caveNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Whisky = mongoose.model("Whisky", whiskySchema);
export default Whisky;

