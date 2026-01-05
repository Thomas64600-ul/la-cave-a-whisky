import Whisky from "../models/Whisky.js";

export async function getAllWhiskies(req, res) {
  try {
    const whiskies = await Whisky.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: whiskies.length,
      data: whiskies,
    });
  } catch (error) {
    console.error("getAllWhiskies error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des whiskies",
    });
  }
}

export async function getWhiskyById(req, res) {
  try {
    const whisky = await Whisky.findById(req.params.id);

    if (!whisky) {
      return res.status(404).json({
        success: false,
        message: "Whisky non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: whisky,
    });
  } catch (error) {
    console.error("getWhiskyById error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du whisky",
    });
  }
}

export async function createWhisky(req, res) {
  try {
    const {
      name,
      brand,
      country,
      category,
      degree,
      age = null,
      price,
      purchasePlace,
      image,
      description = "",
    } = req.body;

    // ✅ Validations simples (messages propres)
    if (!name || !brand || !country || !category) {
      return res.status(400).json({
        success: false,
        message: "Champs obligatoires manquants (nom, marque, pays, catégorie).",
      });
    }

    if (degree === undefined || degree === null) {
      return res.status(400).json({
        success: false,
        message: "Le degré (%) est obligatoire.",
      });
    }

    if (price === undefined || price === null || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Le prix (€) est obligatoire et doit être valide.",
      });
    }

    if (!purchasePlace || String(purchasePlace).trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Le lieu d'achat est obligatoire.",
      });
    }

    // ✅ Unicité du nom
    const exists = await Whisky.findOne({ name: String(name).trim() });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Un whisky portant ce nom existe déjà.",
      });
    }

    // ✅ Whitelist des champs autorisés (sécurité)
    const newWhisky = await Whisky.create({
      name: String(name).trim(),
      brand: String(brand).trim(),
      country: String(country).trim(),
      category: String(category).trim(),
      degree: Number(degree),

      age: age === null || age === "" ? null : Number(age),

      price: Number(price),
      purchasePlace: String(purchasePlace).trim(),

      image: image?.trim() || undefined,
      description: description?.trim() || "",

      // ✅ Champs système (non modifiables par le client)
      inCave: false,
      bottleCount: 0,
      caveNotes: "",
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: "Whisky créé avec succès",
      data: newWhisky,
    });
  } catch (error) {
    console.error("createWhisky error:", error);
    res.status(400).json({
      success: false,
      message: "Erreur lors de la création du whisky",
      error: error.message,
    });
  }
}

export async function updateWhisky(req, res) {
  try {
    const { id } = req.params;

    // ✅ On autorise uniquement certains champs à être modifiés
    const allowedUpdates = [
      "name",
      "brand",
      "country",
      "category",
      "degree",
      "age",
      "price",
      "purchasePlace",
      "image",
      "description",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const whisky = await Whisky.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!whisky) {
      return res.status(404).json({
        success: false,
        message: "Whisky non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Whisky mis à jour avec succès",
      data: whisky,
    });
  } catch (error) {
    console.error("updateWhisky error:", error);
    res.status(400).json({
      success: false,
      message: "Erreur lors de la mise à jour du whisky",
      error: error.message,
    });
  }
}

export async function deleteWhisky(req, res) {
  try {
    const whisky = await Whisky.findByIdAndDelete(req.params.id);

    if (!whisky) {
      return res.status(404).json({
        success: false,
        message: "Whisky non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Whisky supprimé avec succès",
    });
  } catch (error) {
    console.error("deleteWhisky error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du whisky",
    });
  }
}

export async function addToCave(req, res) {
  try {
    const { id } = req.params;
    const { bottleCount = 1, caveNotes = "" } = req.body;

    const whisky = await Whisky.findByIdAndUpdate(
      id,
      {
        inCave: true,
        bottleCount,
        caveNotes,
      },
      { new: true }
    );

    if (!whisky) {
      return res.status(404).json({
        success: false,
        message: "Whisky introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Whisky ajouté à la cave",
      data: whisky,
    });
  } catch (error) {
    console.error("addToCave error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout à la cave",
    });
  }
}

export async function updateCaveInfo(req, res) {
  try {
    const { id } = req.params;

    const whisky = await Whisky.findByIdAndUpdate(
      id,
      {
        ...(req.body.bottleCount !== undefined && {
          bottleCount: req.body.bottleCount,
        }),
        ...(req.body.caveNotes !== undefined && {
          caveNotes: req.body.caveNotes,
        }),
        inCave: true,
      },
      { new: true }
    );

    if (!whisky) {
      return res.status(404).json({
        success: false,
        message: "Whisky introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Informations cave mises à jour",
      data: whisky,
    });
  } catch (error) {
    console.error("updateCaveInfo error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification des informations cave",
    });
  }
}

export async function removeFromCave(req, res) {
  try {
    const whisky = await Whisky.findByIdAndUpdate(
      req.params.id,
      {
        inCave: false,
        bottleCount: 0,
        caveNotes: "",
      },
      { new: true }
    );

    if (!whisky) {
      return res.status(404).json({
        success: false,
        message: "Whisky introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Whisky retiré de la cave",
      data: whisky,
    });
  } catch (error) {
    console.error("removeFromCave error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du retrait de la cave",
    });
  }
}

