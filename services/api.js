const API_BASE = "https://backendgrille.onrender.com/api/draws"; // ← remplace ici par ton IP locale

export async function fetchGrids(
  game = "euromillions",
  mode = "balanced",
  count = 3
) {
  try {
    const res = await fetch(
      `${API_BASE}/generate/${game}?mode=${mode}&count=${count}`
    );
    const json = await res.json();
    return json.grids || [];
  } catch (err) {
    console.error("Erreur fetchGrids:", err);
    return [];
  }
}

export async function fetchStats(game = "euromillions") {
  try {
    const res = await fetch(`${API_BASE}/stats/${game}`);
    const json = await res.json();
    return json.stats || null;
  } catch (err) {
    console.error("Erreur fetchStats:", err);
    return null;
  }
}
