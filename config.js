import Constants from "expo-constants";

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://backendgrille.onrender.com/api/draws";
