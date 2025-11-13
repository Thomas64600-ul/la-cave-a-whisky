export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          status: 401,
          message: "Utilisateur non authentifié.",
        });
      }

      if (!user.role || typeof user.role !== "string") {
        return res.status(403).json({
          success: false,
          status: 403,
          message: "Rôle utilisateur invalide ou manquant.",
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
          status: 403,
          message: "Accès refusé : rôle non autorisé.",
        });
      }

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `Accès autorisé pour ${user.email || "inconnu"} (rôle: ${user.role})`
        );
      }

      next();
    } catch (error) {
      console.error("Erreur authorizeRoles :", error.message);

      res.status(500).json({
        success: false,
        status: 500,
        message: "Erreur interne dans le middleware d'autorisation.",
      });
    }
  };
}

