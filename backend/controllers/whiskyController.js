import Whisky from "../models/Whisky.js";

export async function getAllWhiskies(req, res) {
  try {
    const whiskies = await Whisky.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      status: 200,
      count: whiskies.length,
      data: whiskies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la récupération des whiskies",
      error: error.message,
    });
  }
}

export async function getWhiskyById(req, res) {
  try {
    const whisky = await Whisky.findById(req.params.id);

    if (!whisky) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Whisky non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: whisky,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la récupération du whisky",
      error: error.message,
    });
  }
}

export async function createWhisky(req, res) {
  try {
    const { name, origin, degree, description } = req.body;

    const existingWhisky = await Whisky.findOne({ name });
    if (existingWhisky) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Un whisky portant ce nom existe déjà.",
      });
    }

    const image =
      req.file?.path ||
      req.file?.secure_url ||
      req.body.image;

    const newWhisky = await Whisky.create({
      name,
      origin,
      degree,
      description,
      image,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: "Whisky créé avec succès",
      data: newWhisky,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      message: "Erreur lors de la création du whisky",
      error: error.message,
    });
  }
}

export async function updateWhisky(req, res) {
  try {
    const { id } = req.params;

    if (req.file?.path || req.file?.secure_url) {
      req.body.image = req.file.path || req.file.secure_url;
    }

    const whisky = await Whisky.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!whisky) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Whisky non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Whisky mis à jour avec succès",
      data: whisky,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
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
        status: 404,
        message: "Whisky non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Whisky supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Erreur lors de la suppression du whisky",
      error: error.message,
    });
  }
}
