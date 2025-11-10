export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Utilisateur non authentifié.",
        });
      }

      if (!user.role || typeof user.role !== "string") {
        return res.status(403).json({
          success: false,
          error: "Rôle utilisateur invalide ou manquant.",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `Accès refusé à ${user.email || "inconnu"} (rôle: ${user.role})`
          );
        }
        return res.status(403).json({
          success: false,
          error: "Accès refusé : rôle non autorisé.",
        });
      }

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `Accès autorisé pour ${user.email || "inconnu"} (rôle: ${user.role})`
        );
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Erreur interne dans le middleware d'autorisation.",
      });
    }
  };
}
