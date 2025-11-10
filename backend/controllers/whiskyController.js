import Whisky from "../models/Whisky.js";

export async function getAllWhiskies(req, res) {
  try {
    const whiskies = await Whisky.find().sort({ createdAt: -1 });
    res.status(200).json(whiskies);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des whiskys", error });
  }
}

export async function getWhiskyById(req, res) {
  try {
    const whisky = await Whisky.findById(req.params.id);
    if (!whisky) {
      return res.status(404).json({ message: "Whisky non trouvé" });
    }
    res.status(200).json(whisky);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du whisky", error });
  }
}

export async function createWhisky(req, res) {
  try {
    const { name, origin, degree, description, imageUrl } = req.body;
    const newWhisky = await Whisky.create({ name, origin, degree, description, imageUrl });
    res.status(201).json(newWhisky);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création du whisky", error });
  }
}

export async function updateWhisky(req, res) {
  try {
    const whisky = await Whisky.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!whisky) {
      return res.status(404).json({ message: "Whisky non trouvé" });
    }
    res.status(200).json(whisky);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour du whisky", error });
  }
}

export async function deleteWhisky(req, res) {
  try {
    const whisky = await Whisky.findByIdAndDelete(req.params.id);
    if (!whisky) {
      return res.status(404).json({ message: "Whisky non trouvé" });
    }
    res.status(200).json({ message: "Whisky supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du whisky", error });
  }
}
