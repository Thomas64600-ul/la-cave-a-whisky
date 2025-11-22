const DEFAULT_USER = "Anonyme";
const DEFAULT_COMMENT = "Aucun commentaire";
const STAR = "★";

window.createTastingCard = function (tasting) {
  const username = tasting.user?.username || DEFAULT_USER;
  const rating = tasting.rating ? STAR.repeat(tasting.rating) : "—";
  const comment = tasting.comment?.trim() || DEFAULT_COMMENT;

  return `
    <div class="tasting-card">
      <div class="tasting-header">
        <strong>${username}</strong>
        <span class="tasting-rating">${rating}</span>
      </div>

      <p class="tasting-comment">${comment}</p>

      <div class="tasting-footer">
        <span class="tasting-date">
          ${formatDate(tasting.createdAt)}
        </span>
      </div>
    </div>
  `;
};

function formatDate(dateString) {
  if (!dateString) return "Date inconnue";

  const d = new Date(dateString);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
