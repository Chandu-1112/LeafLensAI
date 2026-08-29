import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HistoryItem {
  id: string;
  disease_name?: string;
  crop?: string;
  disease?: string;
  confidence?: number;
  symptoms?: string[];
  treatment?: string[];
  prevention?: string[];
  imageUri?: string;
  created_at?: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Automatically refresh when navigating to this tab
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem("@diagnosis_history");
      if (data) {
        setHistory(JSON.parse(data));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = (id: string) => {
    Alert.alert(
      "Delete Diagnosis",
      "Are you sure you want to remove this diagnosis record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = history.filter((item) => item.id !== id);
            setHistory(updated);
            await AsyncStorage.setItem(
              "@diagnosis_history",
              JSON.stringify(updated)
            );
          },
        },
      ]
    );
  };

  const clearAllHistory = () => {
    if (history.length === 0) return;
    Alert.alert(
      "Clear All History",
      "This will permanently delete all saved diagnosis records.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            setHistory([]);
            await AsyncStorage.removeItem("@diagnosis_history");
          },
        },
      ]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredHistory = history.filter((item) => {
    const title = item.disease_name || `${item.crop} ${item.disease}` || "";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderHistoryCard = ({ item }: { item: HistoryItem }) => {
    const isExpanded = expandedId === item.id;
    const title = item.disease_name || `${item.crop} - ${item.disease}`;

    return (
      <View style={styles.card}>
        <Pressable
          style={styles.cardHeader}
          onPress={() => toggleExpand(item.id)}
        >
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={{ fontSize: 22 }}>🍃</Text>
            </View>
          )}

          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.cardDate}>
              {item.created_at || "Recent scan"}
            </Text>
          </View>

          {item.confidence !== undefined && (
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {item.confidence <= 1
                  ? `${Math.round(item.confidence * 100)}%`
                  : `${item.confidence}%`}
              </Text>
            </View>
          )}
        </Pressable>

        {isExpanded && (
          <View style={styles.cardExpanded}>
            <View style={styles.divider} />

            {item.treatment && item.treatment.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>💊 Treatment</Text>
                {item.treatment.map((t, idx) => (
                  <Text key={idx} style={styles.detailText}>
                    • {t}
                  </Text>
                ))}
              </View>
            )}

            {item.prevention && item.prevention.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>🛡️ Prevention</Text>
                {item.prevention.map((p, idx) => (
                  <Text key={idx} style={styles.detailText}>
                    • {p}
                  </Text>
                ))}
              </View>
            )}

            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteItem(item.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Delete Entry</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan History</Text>
        {history.length > 0 && (
          <Pressable onPress={clearAllHistory}>
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by crop or disease..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#7B877E"
        />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      ) : filteredHistory.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ fontSize: 40, marginBottom: 10 }}>📋</Text>
          <Text style={styles.emptyTitle}>
            {searchQuery ? "No matches found" : "No history recorded"}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? "Try searching for a different crop or disease name."
              : "Scanned leaf diagnoses will appear saved here."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F9F4",
    paddingTop: 55,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#18351F",
  },
  clearText: {
    color: "#D64545",
    fontSize: 13,
    fontWeight: "800",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#263A2A",
  },
  listContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#EAF3E8",
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#263A2A",
  },
  cardDate: {
    fontSize: 11,
    color: "#7B877E",
    marginTop: 3,
  },
  confidenceBadge: {
    backgroundColor: "#EAF3E8",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2E7D32",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F4F0",
    marginVertical: 12,
  },
  cardExpanded: {
    marginTop: 2,
  },
  detailSection: {
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#263A2A",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#59665C",
    lineHeight: 18,
    marginLeft: 4,
  },
  deleteButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  deleteButtonText: {
    color: "#D64545",
    fontSize: 12,
    fontWeight: "800",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#263A2A",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 12,
    color: "#7B877E",
    textAlign: "center",
    maxWidth: 240,
  },
});