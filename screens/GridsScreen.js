import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TextInput,
  Pressable,
  Animated,
} from "react-native";
import GridCard from "../components/GridCard";
import { fetchGrids } from "../services/api";
import { getFavoriteGrid } from "../services/favorite";

const GAMES = [
  { key: "euromillions", label: "🎯 Euromillions" },
  { key: "loto", label: "💰 Loto" },
  { key: "eurodreams", label: "💭 EuroDreams" },
];

const MODES = [
  { key: "balanced", label: "⚖️ Équilibré" },
  { key: "hot", label: "🔥 Hot" },
  { key: "cold", label: "❄️ Cold" },
];

export default function GridsScreen() {
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState("euromillions");
  const [selectedMode, setSelectedMode] = useState("balanced");
  const [gridCount, setGridCount] = useState("3");

  const loadGrids = async () => {
    const favGrid = await getFavoriteGrid();
    const count = parseInt(gridCount, 10) || 1;
    setLoading(true);
    const data = await fetchGrids(selectedGame, selectedMode, count);
    setGrids(data);
    setLoading(false);
    let finalGrids = [...data];
    if (favGrid) {
      finalGrids.unshift({ ...favGrid, fromFavorite: true });
    }
    setGrids(finalGrids);
  };

  useEffect(() => {
    loadGrids();
  }, [selectedGame, selectedMode]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.label}>🎯 Choix du jeu</Text>
      <View style={styles.buttonGroup}>
        {GAMES.map((game) => (
          <Pressable
            key={game.key}
            onPress={() => setSelectedGame(game.key)}
            style={({ pressed }) => [
              styles.gameButton,
              selectedGame === game.key && styles.gameButtonSelected,
              pressed && styles.gameButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.gameButtonText,
                selectedGame === game.key && styles.gameButtonTextSelected,
              ]}
            >
              {game.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>🎲 Mode de génération</Text>
      <View style={styles.buttonGroup}>
        {MODES.map((mode) => (
          <Pressable
            key={mode.key}
            onPress={() => setSelectedMode(mode.key)}
            style={({ pressed }) => [
              styles.modeButton,
              selectedMode === mode.key && styles.modeButtonSelected,
              pressed && styles.modeButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                selectedMode === mode.key && styles.modeButtonTextSelected,
              ]}
            >
              {mode.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>📦 Nombre de grilles à générer</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={gridCount}
        onChangeText={setGridCount}
        placeholder="Ex : 3"
      />

      <View style={styles.buttonBlock}>
        <Button title="Générer des grilles" onPress={loadGrids} />
      </View>

      {loading && <ActivityIndicator style={{ marginVertical: 15 }} />}
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      ListHeaderComponent={renderHeader}
      data={grids}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <GridCard grid={item} showSave={!item.fromFavorite} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  buttonBlock: {
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  gameButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  gameButtonSelected: {
    backgroundColor: "#4CAF50",
  },
  gameButtonPressed: {
    opacity: 0.85,
  },
  gameButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  gameButtonTextSelected: {
    color: "#fff",
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  modeButtonSelected: {
    backgroundColor: "#2196F3",
  },
  modeButtonPressed: {
    opacity: 0.85,
  },
  modeButtonText: {
    fontSize: 14,
  },
  modeButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});
