import Tasting from "../models/Tasting.js";

export async function getAllTastings(req, res) {
  try {
    const tastings = await Tasting.find()
      .populate("user", "username email role")
      .populate("whisky", "name origin")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      status: 200,
      count: tastings.length,
      data: tastings,
    });
  } catch (error) {
    console.error("Erreur getAllTastings :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la récupération des dégustations",
      error: error.message,
    });
  }
}

export async function getTastingById(req, res) {
  try {
    const tasting = await Tasting.findById(req.params.id)
      .populate("user", "username email")
      .populate("whisky", "name origin");

    if (!tasting) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Dégustation non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: tasting,
    });
  } catch (error) {
    console.error("Erreur getTastingById :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la récupération de la dégustation",
      error: error.message,
    });
  }
}

export async function createTasting(req, res) {
  try {
    const { whisky, rating, comment } = req.body;

    if (!whisky || !rating) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Le whisky et la note sont obligatoires.",
      });
    }

    const existing = await Tasting.findOne({
      user: req.user._id,
      whisky,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Vous avez déjà noté ce whisky.",
      });
    }

    const newTasting = await Tasting.create({
      user: req.user._id,
      whisky,
      rating,
      comment,
    });

    const populatedTasting = await newTasting.populate([
      { path: "user", select: "username email" },
      { path: "whisky", select: "name origin" },
    ]);

    res.status(201).json({
      success: true,
      status: 201,
      message: "Dégustation ajoutée avec succès",
      data: populatedTasting,
    });
  } catch (error) {
    console.error("Erreur createTasting :", error.message);
    res.status(400).json({
      success: false,
      status: 400,
      message: "Erreur lors de la création de la dégustation",
      error: error.message,
    });
  }
}

export async function updateTasting(req, res) {
  try {
    const tasting = await Tasting.findById(req.params.id);
    if (!tasting) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Dégustation non trouvée",
      });
    }

    if (
      tasting.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "Accès refusé : vous n'êtes pas l'auteur de cette dégustation.",
      });
    }

    const updated = await Tasting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "username email")
      .populate("whisky", "name origin");

    res.status(200).json({
      success: true,
      status: 200,
      message: "Dégustation mise à jour avec succès",
      data: updated,
    });
  } catch (error) {
    console.error("Erreur updateTasting :", error.message);
    res.status(400).json({
      success: false,
      status: 400,
      message: "Erreur lors de la mise à jour de la dégustation",
      error: error.message,
    });
  }
}

export async function deleteTasting(req, res) {
  try {
    const tasting = await Tasting.findById(req.params.id);
    if (!tasting) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Dégustation non trouvée",
      });
    }

    if (
      tasting.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "Suppression refusée : vous n'êtes pas l'auteur de cette dégustation.",
      });
    }

    await tasting.deleteOne();
    res.status(200).json({
      success: true,
      status: 200,
      message: "Dégustation supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteTasting :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la suppression de la dégustation",
      error: error.message,
    });
  }
}

export async function getUserTastings(req, res) {
  try {
    const tastings = await Tasting.find({ user: req.user._id })
      .populate("whisky", "name origin")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      status: 200,
      count: tastings.length,
      data: tastings,
    });
  } catch (error) {
    console.error("Erreur getUserTastings :", error.message);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la récupération des dégustations de l'utilisateur",
      error: error.message,
    });
  }
}
