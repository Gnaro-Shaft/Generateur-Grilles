import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { fetchStats } from "../services/api";

const GAMES = [
  { key: "euromillions", label: "🎯 Euromillions", max: 50 },
  { key: "loto", label: "💰 Loto", max: 49 },
  { key: "eurodreams", label: "💭 EuroDreams", max: 40 },
];

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState("euromillions");
  const [maxNumber, setMaxNumber] = useState(50);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const data = await fetchStats(selectedGame);
      setStats(data);
      const foundGame = GAMES.find((g) => g.key === selectedGame);
      setMaxNumber(foundGame ? foundGame.max : 50);
      setLoading(false);
    };
    loadStats();
  }, [selectedGame]);

  const calculateAdvancedStats = () => {
    const totalDraws = stats?.totalDraws || 1;
    const ecarts = [];
    const now = totalDraws;

    let lastSeen = Array(maxNumber + 1).fill(0);

    stats.numero_frequencies?.forEach((item) => {
      const lastDraw = now - item.count;
      ecarts.push({ number: item.number, ecart: lastDraw });
    });

    const pairs = stats.numero_frequencies.filter(
      (n) => n.number % 2 === 0
    ).length;
    const impairs = stats.numero_frequencies.length - pairs;

    const half = Math.floor(maxNumber / 2);
    const bas = stats.numero_frequencies.filter((n) => n.number <= half).length;
    const hauts = stats.numero_frequencies.length - bas;

    return {
      ecarts,
      pairs,
      impairs,
      bas,
      hauts,
    };
  };

  const adv = stats ? calculateAdvancedStats() : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Choix du jeu</Text>
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

      {loading ? (
        <ActivityIndicator />
      ) : stats ? (
        <>
          <Text style={styles.sectionTitle}>📊 Fréquence des numéros</Text>
          <FlatList
            data={stats.numero_frequencies}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => (
              <Text style={styles.statLine}>
                {item.number} → {item.count}
              </Text>
            )}
          />

          <Text style={styles.sectionTitle}>📈 Écart (retard) des numéros</Text>
          <FlatList
            data={adv.ecarts.sort((a, b) => b.ecart - a.ecart)}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => (
              <Text style={styles.statLine}>
                {item.number} → {item.ecart} tirages depuis
              </Text>
            )}
          />

          <Text style={styles.sectionTitle}>📎 Répartition Pair / Impair</Text>
          <Text style={styles.statLine}>
            ⚖️ Pairs : {adv.pairs} / Impairs : {adv.impairs}
          </Text>

          <Text style={styles.sectionTitle}>📎 Répartition Bas / Haut</Text>
          <Text style={styles.statLine}>
            🔻 Bas (1 à {Math.floor(maxNumber / 2)}): {adv.bas} / 🔺 Haut (
            {Math.floor(maxNumber / 2) + 1} à {maxNumber}): {adv.hauts}
          </Text>
        </>
      ) : (
        <Text>Aucune statistique disponible</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
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
  gameButtonSelected: { backgroundColor: "#4CAF50" },
  gameButtonPressed: { opacity: 0.85 },
  gameButtonText: { fontSize: 14, fontWeight: "600" },
  gameButtonTextSelected: { color: "#fff" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  statLine: { fontSize: 14, paddingVertical: 4 },
});
