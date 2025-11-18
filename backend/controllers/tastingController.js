import Tasting from "../models/Tasting.js";

export async function getAllTastings(req, res) {
  try {
    const tastings = await Tasting.find()
      .populate("user", "username email role")
      .populate("whisky", "name country brand")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tastings.length,
      data: tastings,
    });
  } catch (error) {
    console.error("getAllTastings error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des dégustations.",
    });
  }
}

export async function getTastingById(req, res) {
  try {
    const tasting = await Tasting.findById(req.params.id)
      .populate("user", "username email role")
      .populate("whisky", "name country brand");

    if (!tasting) {
      return res.status(404).json({
        success: false,
        message: "Dégustation non trouvée.",
      });
    }

    res.status(200).json({
      success: true,
      data: tasting,
    });
  } catch (error) {
    console.error("getTastingById error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la dégustation.",
    });
  }
}

export async function createTasting(req, res) {
  try {
    const { whisky, rating, comment } = req.body;

    if (!whisky || !rating) {
      return res.status(400).json({
        success: false,
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
        message: "Vous avez déjà noté ce whisky.",
      });
    }

    const tasting = await Tasting.create({
      user: req.user._id,
      whisky,
      rating,
      comment,
    });

    const populated = await tasting.populate([
      { path: "user", select: "username email" },
      { path: "whisky", select: "name country brand" },
    ]);

    res.status(201).json({
      success: true,
      message: "Dégustation ajoutée avec succès.",
      data: populated,
    });
  } catch (error) {
    console.error("createTasting error:", error);
    res.status(400).json({
      success: false,
      message: "Erreur lors de la création de la dégustation.",
    });
  }
}

export async function updateTasting(req, res) {
  try {
    const tasting = await Tasting.findById(req.params.id);

    if (!tasting) {
      return res.status(404).json({
        success: false,
        message: "Dégustation non trouvée.",
      });
    }

    
    const isOwner = tasting.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez modifier que vos propres dégustations.",
      });
    }

    tasting.rating = req.body.rating ?? tasting.rating;
    tasting.comment = req.body.comment ?? tasting.comment;

    const updated = await tasting.save();

    const populated = await updated.populate([
      { path: "user", select: "username email" },
      { path: "whisky", select: "name country brand" },
    ]);

    res.status(200).json({
      success: true,
      message: "Dégustation mise à jour avec succès.",
      data: populated,
    });
  } catch (error) {
    console.error("updateTasting error:", error);
    res.status(400).json({
      success: false,
      message: "Erreur lors de la mise à jour.",
    });
  }
}

export async function deleteTasting(req, res) {
  try {
    const tasting = await Tasting.findById(req.params.id);

    if (!tasting) {
      return res.status(404).json({
        success: false,
        message: "Dégustation non trouvée.",
      });
    }

    const isOwner = tasting.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez supprimer que vos propres dégustations.",
      });
    }

    await tasting.deleteOne();

    res.status(200).json({
      success: true,
      message: "Dégustation supprimée avec succès.",
    });
  } catch (error) {
    console.error("deleteTasting error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression.",
    });
  }
}

export async function getUserTastings(req, res) {
  try {
    const tastings = await Tasting.find({ user: req.user._id })
      .populate("whisky", "name country brand")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tastings.length,
      data: tastings,
    });
  } catch (error) {
    console.error("getUserTastings error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des dégustations de l'utilisateur.",
    });
  }
}

export async function getTastingsForWhisky(req, res) {
  try {
    const tastings = await Tasting.find({ whisky: req.params.whiskyId })
      .populate("user", "username email")
      .populate("whisky", "name country brand")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tastings.length,
      data: tastings,
    });
  } catch (error) {
    console.error("getTastingsForWhisky error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des dégustations du whisky.",
    });
  }
}

