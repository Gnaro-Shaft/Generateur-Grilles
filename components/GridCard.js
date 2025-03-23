import React from "react";
import { View, Text, StyleSheet } from "react-native";

const GridCard = ({ grid }) => {
  const avgFreq = Number(grid.stats?.avg_frequency || 0).toFixed(1);
  const avgSpecial = Number(grid.stats?.special_avg_frequency || 0).toFixed(1);
  const avgEcart = Number(grid.stats?.avg_ecart || 0).toFixed(1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎯 Grille</Text>

      {/* Numéros principaux */}
      <Text style={styles.label}>Numéros :</Text>
      <Text style={styles.numbers}>
        {grid.numeros && grid.numeros.length > 0
          ? grid.numeros.join(" - ")
          : "Aucun numéro"}
      </Text>

      {/* Numéros spéciaux conditionnels */}
      {grid.etoiles?.length > 0 && (
        <>
          <Text style={styles.label}>✨ Étoiles :</Text>
          <Text style={styles.numbers}>{grid.etoiles.join(" - ")}</Text>
        </>
      )}

      {grid.numero_chance !== undefined && grid.numero_chance !== null && (
        <>
          <Text style={styles.label}>🍀 Numéro Chance :</Text>
          <Text style={styles.numbers}>{grid.numero_chance}</Text>
        </>
      )}

      {grid.numero_reve !== undefined && grid.numero_reve !== null && (
        <>
          <Text style={styles.label}>🌙 Numéro Rêve :</Text>
          <Text style={styles.numbers}>{grid.numero_reve}</Text>
        </>
      )}

      {/* Statistiques */}
      <Text style={styles.label}>📊 Statistiques :</Text>
      <Text style={styles.stats}>Fréquence moyenne : {avgFreq}</Text>
      <Text style={styles.stats}>Fréquence spéciale : {avgSpecial}</Text>
      <Text style={styles.stats}>Écart moyen : {avgEcart}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },
  numbers: {
    fontSize: 16,
    marginBottom: 4,
  },
  stats: {
    fontSize: 13,
    color: "#444",
  },
});

export default GridCard;
