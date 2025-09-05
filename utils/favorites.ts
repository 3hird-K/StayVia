import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper key — in real apps, prefix with userId like `favorites_${userId}`
const FAVORITES_KEY = "favorites";

export const getFavorites = async (): Promise<string[]> => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error("Error reading favorites", err);
    return [];
  }
};

export const isFavorite = async (id: string): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(id);
};

export const toggleFavorite = async (id: string): Promise<boolean> => {
  const favorites = await getFavorites();
  let updated: string[];

  if (favorites.includes(id)) {
    updated = favorites.filter((f) => f !== id);
  } else {
    updated = [...favorites, id];
  }

  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving favorites", err);
  }

  return updated.includes(id); // return new state
};
