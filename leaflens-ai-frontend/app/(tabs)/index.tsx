import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.65.19:8000";
const { width } = Dimensions.get("window");

interface DiagnosisItem {
  id: string | number;
  disease_name?: string;
  name?: string;
  confidence?: number | string;
  created_at?: string;
  date?: string;
  image_url?: string;
  imageUri?: string;
}

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [recentDiagnosis, setRecentDiagnosis] = useState<DiagnosisItem | null>(null);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      loadRecentLocalDiagnosis();
    }, [])
  );

  const loadRecentLocalDiagnosis = async () => {
    try {
      setLoadingHistory(true);
      const storedHistory = await AsyncStorage.getItem("@diagnosis_history");
      if (storedHistory) {
        const parsedHistory: DiagnosisItem[] = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setRecentDiagnosis(parsedHistory[0]);
        } else {
          setRecentDiagnosis(null);
        }
      } else {
        setRecentDiagnosis(null);
      }
    } catch (error) {
      console.log("Error reading local history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera Permission",
          "Please allow camera access to take a leaf photo."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Camera Error", "Failed to open camera.");
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Gallery Permission",
          "Please allow gallery access to select a leaf photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Gallery Error", "Failed to pick an image.");
    }
  };

  const safeNavigate = (pathname: string, params?: Record<string, string>) => {
    try {
      router.push({ pathname: pathname as any, params });
    } catch (err) {
      Alert.alert(
        "Navigation Error",
        `Target route (${pathname}) does not exist in app directory.`
      );
    }
  };

  const analyzeLeaf = () => {
    if (!image) {
      Alert.alert(
        "No Leaf Selected",
        "Please take a photo or choose a leaf image first."
      );
      return;
    }

    safeNavigate("/diagnosis", { image });
  };

  const scanLeaf = () => {
    if (image) {
      analyzeLeaf();
    } else {
      takePhoto();
    }
  };

  const showAboutInfo = () => {
    Alert.alert(
      "Crop Doctor",
      "Crop Doctor uses AI to detect crop diseases from leaf images and provide useful treatment and prevention recommendations."
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.smallGreeting}>Good day 👋</Text>
          <Text style={styles.greeting}>Hello, User</Text>
        </View>

        <Pressable
          style={styles.notificationButton}
          onPress={() => Alert.alert("Notifications", "No new notifications")}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      {/* BRAND */}
      <View style={styles.brandContainer}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandEmoji}>🌿</Text>
        </View>

        <View>
          <Text style={styles.brandTitle}>Crop Doctor</Text>
          <Text style={styles.brandSubtitle}>Smart crop health companion</Text>
        </View>
      </View>

      {/* HERO */}
      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>✨ AI POWERED</Text>
          </View>

          <Text style={styles.heroTitle}>Protect Your{"\n"}Crops With AI</Text>

          <Text style={styles.heroDescription}>
            Detect crop diseases from a simple leaf photo and get instant
            recommendations.
          </Text>

          <Pressable style={styles.heroButton} onPress={scanLeaf}>
            <Text style={styles.heroButtonText}>
              {image ? "🔍 Analyze Leaf" : "📷 Scan Your Leaf"}
            </Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        <View style={styles.heroPlantContainer}>
          <Text style={styles.heroPlant}>🌱</Text>
          <View style={styles.circleOne} />
          <View style={styles.circleTwo} />
        </View>
      </View>

      {/* UPLOAD OPTIONS */}
      <Text style={styles.sectionTitle}>Start Diagnosis</Text>

      <View style={styles.uploadRow}>
        <Pressable style={styles.uploadCard} onPress={takePhoto}>
          <View style={styles.uploadIconCamera}>
            <Text style={styles.uploadEmoji}>📷</Text>
          </View>
          <Text style={styles.uploadTitle}>Take Photo</Text>
          <Text style={styles.uploadSubtitle}>Use camera</Text>
        </Pressable>

        <Pressable style={styles.uploadCard} onPress={pickImage}>
          <View style={styles.uploadIconGallery}>
            <Text style={styles.uploadEmoji}>🖼️</Text>
          </View>
          <Text style={styles.uploadTitle}>Gallery</Text>
          <Text style={styles.uploadSubtitle}>Choose image</Text>
        </Pressable>
      </View>

      {/* SELECTED IMAGE */}
      {image && (
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View>
              <Text style={styles.previewTitle}>Leaf Selected</Text>
              <Text style={styles.previewSubtitle}>Ready for AI analysis</Text>
            </View>

            <Pressable onPress={() => setImage(null)}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>

          <Image source={{ uri: image }} style={styles.previewImage} />

          <Pressable style={styles.analyzeButton} onPress={analyzeLeaf}>
            <Text style={styles.analyzeButtonText}>🔍 Analyze Leaf</Text>
            <Text style={styles.analyzeArrow}>→</Text>
          </Pressable>
        </View>
      )}

      {/* RECENT DIAGNOSIS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Diagnosis</Text>
        <Pressable onPress={() => safeNavigate("/(tabs)/history")}>
          <Text style={styles.viewAll}>View all</Text>
        </Pressable>
      </View>

      {loadingHistory ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color="#2E7D32" />
        </View>
      ) : recentDiagnosis ? (
        <Pressable
          style={styles.recentCard}
          onPress={() => safeNavigate("/(tabs)/history")}
        >
          {recentDiagnosis.image_url || recentDiagnosis.imageUri ? (
            <Image
              source={{
                uri: recentDiagnosis.image_url || recentDiagnosis.imageUri,
              }}
              style={styles.recentImage}
            />
          ) : (
            <View style={styles.recentIconPlaceholder}>
              <Text style={{ fontSize: 22 }}>🍃</Text>
            </View>
          )}

          <View style={styles.recentContent}>
            <Text style={styles.recentTitle} numberOfLines={1}>
              {recentDiagnosis.disease_name || recentDiagnosis.name || "Leaf Diagnosis"}
            </Text>
            <Text style={styles.recentSubtitle}>
              {recentDiagnosis.created_at || recentDiagnosis.date || "Recently scanned"}
            </Text>
          </View>

          {recentDiagnosis.confidence && (
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {typeof recentDiagnosis.confidence === "number"
                  ? `${Math.round(recentDiagnosis.confidence * 100)}%`
                  : recentDiagnosis.confidence}
              </Text>
            </View>
          )}
        </Pressable>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyEmoji}>🌱</Text>
          </View>

          <View style={styles.emptyContent}>
            <Text style={styles.emptyTitle}>No diagnoses yet</Text>
            <Text style={styles.emptyText}>
              Scan a leaf to see your diagnosis history here.
            </Text>
          </View>
        </View>
      )}

      {/* ABOUT */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>About</Text>
      </View>

      <Pressable style={styles.aboutCard} onPress={showAboutInfo}>
        <View style={styles.aboutIconContainer}>
          <Text style={styles.aboutIcon}>ℹ️</Text>
        </View>

        <View style={styles.aboutContent}>
          <Text style={styles.aboutTitle}>About Crop Doctor</Text>
          <Text style={styles.aboutText}>
            Learn how Crop Doctor uses AI to detect crop diseases and assist
            your farming decisions.
          </Text>
        </View>
      </Pressable>

      {/* TIP */}
      <View style={styles.tipCard}>
        <View style={styles.tipIconContainer}>
          <Text style={styles.tipIcon}>💡</Text>
        </View>

        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Get better results</Text>
          <Text style={styles.tipText}>
            Take a clear photo of the affected leaf in good lighting. Make sure
            the leaf is clearly visible.
          </Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F9F4",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  smallGreeting: {
    fontSize: 13,
    color: "#7A877D",
    marginBottom: 3,
  },
  greeting: {
    fontSize: 23,
    fontWeight: "900",
    color: "#18351F",
  },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  notificationIcon: {
    fontSize: 21,
  },
  notificationDot: {
    position: "absolute",
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E53935",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#DFF0DF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  brandEmoji: {
    fontSize: 27,
  },
  brandTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#2E7D32",
  },
  brandSubtitle: {
    fontSize: 12,
    color: "#77837A",
    marginTop: 2,
  },
  heroCard: {
    minHeight: 245,
    borderRadius: 28,
    backgroundColor: "#267337",
    padding: 22,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 28,
  },
  heroContent: {
    flex: 1,
    zIndex: 5,
  },
  aiBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 13,
  },
  aiBadgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 27,
    lineHeight: 32,
    fontWeight: "900",
    color: "white",
    marginBottom: 10,
  },
  heroDescription: {
    color: "#DCEDDD",
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 205,
    marginBottom: 18,
  },
  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 13,
    paddingVertical: 11,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  heroButtonText: {
    color: "#267337",
    fontSize: 13,
    fontWeight: "900",
  },
  arrow: {
    color: "#267337",
    fontSize: 18,
    fontWeight: "900",
    marginLeft: 8,
  },
  heroPlantContainer: {
    width: 95,
    justifyContent: "center",
    alignItems: "center",
  },
  heroPlant: {
    fontSize: 82,
    zIndex: 5,
  },
  circleOne: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.06)",
    right: -55,
  },
  circleTwo: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    right: -20,
    top: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#263A2A",
    marginBottom: 14,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 14,
  },
  uploadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  uploadCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 17,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  uploadIconCamera: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#E4F2E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadIconGallery: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#E8F0FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadEmoji: {
    fontSize: 23,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#263A2A",
  },
  uploadSubtitle: {
    fontSize: 11,
    color: "#7C887F",
    marginTop: 4,
  },
  previewCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 14,
    marginBottom: 28,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#263A2A",
  },
  previewSubtitle: {
    fontSize: 11,
    color: "#7B877E",
    marginTop: 3,
  },
  removeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#D64545",
  },
  previewImage: {
    width: "100%",
    height: width * 0.55,
    borderRadius: 16,
    marginBottom: 13,
  },
  analyzeButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 13,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  analyzeButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "900",
  },
  analyzeArrow: {
    color: "white",
    fontSize: 19,
    fontWeight: "900",
    marginLeft: 9,
  },
  loadingCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  recentCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  recentImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  recentIconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#EAF3E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#293C2E",
  },
  recentSubtitle: {
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
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIcon: {
    width: 55,
    height: 55,
    borderRadius: 17,
    backgroundColor: "#EAF3E8",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 27,
  },
  emptyContent: {
    flex: 1,
    marginLeft: 13,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#293C2E",
  },
  emptyText: {
    fontSize: 11,
    color: "#7B877E",
    lineHeight: 16,
    marginTop: 4,
  },
  aboutCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  aboutIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EBF3FB",
    justifyContent: "center",
    alignItems: "center",
  },
  aboutIcon: {
    fontSize: 22,
  },
  aboutContent: {
    flex: 1,
    marginLeft: 13,
  },
  aboutTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#293C2E",
  },
  aboutText: {
    fontSize: 11,
    color: "#7B877E",
    lineHeight: 16,
    marginTop: 3,
  },
  tipCard: {
    backgroundColor: "#EAF3E8",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  tipIcon: {
    fontSize: 21,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#29432E",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 11,
    color: "#68776B",
    lineHeight: 17,
  },
});