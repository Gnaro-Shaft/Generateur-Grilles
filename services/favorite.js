import AsyncStorage from "@react-native-async-storage/async-storage";

const FAV_KEY = "FAVORITE_GRID";

export async function saveFavoriteGrid(grid) {
  try {
    await AsyncStorage.setItem(FAV_KEY, JSON.stringify(grid));
  } catch (err) {
    console.error("Erreur saveFavoriteGrid:", err);
  }
}

export async function getFavoriteGrid() {
  try {
    const json = await AsyncStorage.getItem(FAV_KEY);
    return json ? JSON.parse(json) : null;
  } catch (err) {
    console.error("Erreur getFavoriteGrid:", err);
    return null;
  }
}

export async function clearFavoriteGrid() {
  try {
    await AsyncStorage.removeItem(FAV_KEY);
  } catch (err) {
    console.error("Erreur clearFavoriteGrid:", err);
  }
}
