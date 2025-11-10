import User from "../models/User.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs", error });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'utilisateur", error });
  }
}

export async function createUser(req, res) {
  try {
    const { username, email, password, role, avatar } = req.body;

    const newUser = await User.create({
      username,
      email,
      password,
      role,
      avatar, 
    });

    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la création de l'utilisateur", error });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la mise à jour de l'utilisateur", error });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'utilisateur", error });
  }
}
