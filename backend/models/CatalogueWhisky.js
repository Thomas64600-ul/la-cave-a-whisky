import mongoose from "mongoose";

const CatalogueWhiskySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    country: { type: String, required: true },
    category: { type: String, required: true },
    degree: { type: Number, required: true },
    year: { type: Number, default: null },
    description: { type: String, default: "" },
    image: { type: String, default: "/images/placeholder-whisky.jpg" },
  },
  { timestamps: true }
);

export default mongoose.model("CatalogueWhisky", CatalogueWhiskySchema);
