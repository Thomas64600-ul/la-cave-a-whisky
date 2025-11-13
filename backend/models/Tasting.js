import mongoose from "mongoose";

const tastingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'utilisateur est requis"],
    },
    whisky: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Whisky",
      required: [true, "Le whisky est requis"],
    },
    rating: {
      type: Number,
      required: [true, "La note est obligatoire"],
      min: [1, "La note minimale est 1"],
      max: [5, "La note maximale est 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Le commentaire ne peut pas dépasser 500 caractères"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

tastingSchema.index({ user: 1, whisky: 1 }, { unique: true });

const Tasting = mongoose.model("Tasting", tastingSchema);
export default Tasting;
