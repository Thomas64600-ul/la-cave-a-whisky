export async function loadComponent(targetId, filePath) {
  const container = document.getElementById(targetId);
  if (!container) return;

  try {
    const res = await fetch(filePath);
    const html = await res.text();
    container.innerHTML = html;
  } catch (error) {
    console.error(`Erreur lors du chargement de ${filePath}`, error);
  }
}
