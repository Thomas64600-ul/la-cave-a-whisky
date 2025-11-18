export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Utilisateur non authentifié.",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Ce compte a été désactivé par un administrateur.",
        });
      }

      if (!user.role || typeof user.role !== "string") {
        return res.status(403).json({
          success: false,
          message: "Rôle utilisateur invalide ou manquant.",
        });
      }

      if (user.role === "admin") {
        if (process.env.NODE_ENV !== "production") {
          console.log(`✔ ADMIN → accès autorisé (${user.email})`);
        }
        return next();
      }

      if (!allowedRoles.includes(user.role)) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `Accès refusé pour ${user.email} (rôle: ${user.role}). ` +
              `Rôles requis : ${allowedRoles.join(", ")}`
          );
        }

        return res.status(403).json({
          success: false,
          message: `Accès refusé : rôle requis = ${allowedRoles.join(", ")}`,
        });
      }

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `Accès autorisé pour ${user.email} (rôle: ${user.role})`
        );
      }

      next();

    } catch (error) {
      console.error("Erreur authorizeRoles :", error);

      res.status(500).json({
        success: false,
        message: "Erreur interne dans le middleware d'autorisation.",
      });
    }
  };
}
