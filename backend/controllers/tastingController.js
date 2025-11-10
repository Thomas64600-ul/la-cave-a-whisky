import Tasting from "../models/Tasting.js";

export async function getAllTastings(req, res) {
  try {
    const tastings = await Tasting.find()
      .populate("user", "username email")
      .populate("whisky", "name origin")
      .sort({ createdAt: -1 });

    res.status(200).json(tastings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des dégustations", error });
  }
}

export async function getTastingById(req, res) {
  try {
    const tasting = await Tasting.findById(req.params.id)
      .populate("user", "username email")
      .populate("whisky", "name origin");

    if (!tasting) {
      return res.status(404).json({ message: "Dégustation non trouvée" });
    }
    res.status(200).json(tasting);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la dégustation", error });
  }
}

export async function createTasting(req, res) {
  try {
    const { user, whisky, rating, comment } = req.body;
    const newTasting = await Tasting.create({ user, whisky, rating, comment });
    res.status(201).json(newTasting);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la création de la dégustation", error });
  }
}

export async function updateTasting(req, res) {
  try {
    const tasting = await Tasting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tasting) {
      return res.status(404).json({ message: "Dégustation non trouvée" });
    }
    res.status(200).json(tasting);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la mise à jour de la dégustation", error });
  }
}

export async function deleteTasting(req, res) {
  try {
    const tasting = await Tasting.findByIdAndDelete(req.params.id);
    if (!tasting) {
      return res.status(404).json({ message: "Dégustation non trouvée" });
    }
    res.status(200).json({ message: "Dégustation supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la dégustation", error });
  }
}
