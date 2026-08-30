import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace with your production FastAPI URL or local development IP
const API_URL = "http://192.168.65.19:8000";

const { width } = Dimensions.get("window");

type Prediction = {
  crop: string;
  disease: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
  pesticides: string[]; // <-- Added pesticides array type
  prevention: string[];
};

export default function DiagnosisScreen() {
  const { image } = useLocalSearchParams<{ image: string }>();

  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (image) {
      analyzeImage();
    }
  }, [image]);

  // ==========================================
  // SAVE DIAGNOSIS TO LOCAL ASYNCSTORAGE
  // ==========================================
  const saveToLocalHistory = async (data: Prediction, imageUri: string) => {
    try {
      const existingData = await AsyncStorage.getItem("@diagnosis_history");
      const historyList = existingData ? JSON.parse(existingData) : [];

      const newEntry = {
        id: Date.now().toString(),
        disease_name: `${data.crop} - ${data.disease}`,
        crop: data.crop,
        disease: data.disease,
        confidence: data.confidence,
        symptoms: data.symptoms || [],
        treatment: data.treatment || [],
        pesticides: data.pesticides || [], // <-- Save pesticides to history storage too
        prevention: data.prevention || [],
        imageUri: imageUri,
        created_at: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      const updatedHistory = [newEntry, ...historyList];
      await AsyncStorage.setItem(
        "@diagnosis_history",
        JSON.stringify(updatedHistory)
      );
    } catch (e) {
      console.error("Error saving to AsyncStorage:", e);
    }
  };

  // ==========================================
  // SEND IMAGE TO FASTAPI
  // ==========================================
  const analyzeImage = async () => {
    try {
      setLoading(true);
      setError(false);

      const formData = new FormData();

      formData.append("file", {
        uri: image,
        name: "leaf.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: Prediction = await response.json();
      console.log("Diagnosis response:", data);

      setPrediction(data);

      // Persist entry locally for Home & History screens
      if (image) {
        await saveToLocalHistory(data, image);
      }
    } catch (err) {
      console.error("Diagnosis error:", err);
      setError(true);

      Alert.alert(
        "Analysis Failed",
        "Unable to analyze the leaf. Please check your internet connection and make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <Text style={styles.loadingEmoji}>🌿</Text>
        </View>

        <Text style={styles.loadingTitle}>Analyzing Your Leaf</Text>

        <Text style={styles.loadingText}>
          Our AI is examining the image and identifying possible diseases...
        </Text>

        <ActivityIndicator
          size="large"
          color="#2E7D32"
          style={styles.loader}
        />

        <Text style={styles.loadingSmall}>This may take a few seconds</Text>
      </View>
    );
  }

  // ==========================================
  // ERROR SCREEN
  // ==========================================
  if (error || !prediction) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😕</Text>

        <Text style={styles.errorTitle}>Something went wrong</Text>

        <Text style={styles.errorText}>
          We couldn't analyze this leaf. Please try again.
        </Text>

        <Pressable style={styles.retryButton} onPress={analyzeImage}>
          <Text style={styles.retryText}>🔄 Try Again</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // ==========================================
  // DIAGNOSIS RESULT
  // ==========================================
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Text style={styles.headerButtonText}>←</Text>
        </Pressable>

        <Text style={styles.headerTitle}>AI Diagnosis</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* IMAGE */}
      <View style={styles.imageCard}>
        <Image source={{ uri: image }} style={styles.leafImage} />

        <View style={styles.imageBadge}>
          <Text style={styles.imageBadgeText}>✓ Image Analyzed</Text>
        </View>
      </View>

      {/* DIAGNOSIS */}
      <View style={styles.diagnosisCard}>
        <View style={styles.diagnosisHeader}>
          <View style={styles.diagnosisIcon}>
            <Text style={styles.diagnosisEmoji}>🩺</Text>
          </View>

          <View style={styles.diagnosisHeaderText}>
            <Text style={styles.diagnosisLabel}>AI DIAGNOSIS</Text>
            <Text style={styles.cropName}>{prediction.crop}</Text>
          </View>
        </View>

        <Text style={styles.diseaseLabel}>Detected Disease</Text>
        <Text style={styles.diseaseName}>{prediction.disease}</Text>

        {/* CONFIDENCE */}
        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceLabel}>AI Confidence</Text>
          <Text style={styles.confidenceValue}>
            {typeof prediction.confidence === "number" && prediction.confidence <= 1
              ? `${Math.round(prediction.confidence * 100)}%`
              : `${prediction.confidence}%`}
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  typeof prediction.confidence === "number" && prediction.confidence <= 1
                    ? prediction.confidence * 100
                    : prediction.confidence,
                  100
                )}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* SYMPTOMS */}
      {prediction.symptoms && prediction.symptoms.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text>🔎</Text>
            </View>
            <Text style={styles.sectionTitle}>Symptoms</Text>
          </View>

          {prediction.symptoms.map((symptom, index) => (
            <View key={index} style={styles.listRow}>
              <View style={styles.bullet}>
                <Text style={styles.bulletText}>✓</Text>
              </View>
              <Text style={styles.listText}>{symptom}</Text>
            </View>
          ))}
        </View>
      )}

      {/* TREATMENT */}
      {prediction.treatment && prediction.treatment.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text>💊</Text>
            </View>
            <Text style={styles.sectionTitle}>Treatment</Text>
          </View>

          {prediction.treatment.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* PESTICIDES */}
      {prediction.pesticides && prediction.pesticides.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text>🧪</Text>
            </View>
            <Text style={styles.sectionTitle}>Recommended Pesticides</Text>
          </View>

          {prediction.pesticides.map((pesticide, index) => (
            <View key={index} style={styles.listRow}>
              <View style={styles.bullet}>
                <Text style={styles.bulletText}>•</Text>
              </View>
              <Text style={styles.listText}>{pesticide}</Text>
            </View>
          ))}
        </View>
      )}

      {/* PREVENTION */}
      {prediction.prevention && prediction.prevention.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Text>🛡️</Text>
            </View>
            <Text style={styles.sectionTitle}>Prevention</Text>
          </View>

          {prediction.prevention.map((item, index) => (
            <View key={index} style={styles.listRow}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ACTION BUTTONS */}
      <Pressable style={styles.newScanButton} onPress={() => router.back()}>
        <Text style={styles.newScanText}>📷 Scan Another Leaf</Text>
      </Pressable>

      <Pressable
        style={styles.homeButton}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.homeButtonText}>🏠 Back to Home</Text>
      </Pressable>

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
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonText: {
    fontSize: 25,
    color: "#263A2A",
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#18351F",
  },
  headerSpacer: {
    width: 42,
  },
  imageCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 10,
    marginBottom: 18,
    position: "relative",
  },
  leafImage: {
    width: "100%",
    height: width * 0.62,
    borderRadius: 16,
  },
  imageBadge: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#2E7D32",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  imageBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "800",
  },
  diagnosisCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
  },
  diagnosisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  diagnosisIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EAF3E8",
    justifyContent: "center",
    alignItems: "center",
  },
  diagnosisEmoji: {
    fontSize: 27,
  },
  diagnosisHeaderText: {
    marginLeft: 13,
  },
  diagnosisLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#7B877E",
    letterSpacing: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#263A2A",
    marginTop: 3,
  },
  diseaseLabel: {
    fontSize: 12,
    color: "#7B877E",
    marginBottom: 5,
  },
  diseaseName: {
    fontSize: 25,
    fontWeight: "900",
    color: "#C45D20",
    marginBottom: 20,
  },
  confidenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 13,
    color: "#68776B",
    fontWeight: "600",
  },
  confidenceValue: {
    fontSize: 17,
    color: "#2E7D32",
    fontWeight: "900",
  },
  progressBackground: {
    height: 9,
    borderRadius: 10,
    backgroundColor: "#E4EAE4",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 10,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 19,
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EAF3E8",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#263A2A",
    marginLeft: 11,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 13,
  },
  bullet: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#EAF3E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 1,
  },
  bulletText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "900",
  },
  numberCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#EAF3E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 1,
  },
  numberText: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "900",
  },
  listText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#59665C",
  },
  newScanButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 11,
  },
  newScanText: {
    color: "white",
    fontSize: 15,
    fontWeight: "900",
  },
  homeButton: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCE7DC",
  },
  homeButtonText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "800",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F5F9F4",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },
  loadingIcon: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: "#EAF3E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  loadingEmoji: {
    fontSize: 48,
  },
  loadingTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: "#18351F",
    marginBottom: 10,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#718075",
    textAlign: "center",
  },
  loader: {
    marginTop: 25,
  },
  loadingSmall: {
    marginTop: 12,
    fontSize: 11,
    color: "#8A958C",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#F5F9F4",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },
  errorEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#263A2A",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#718075",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 25,
  },
  retryButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  retryText: {
    color: "white",
    fontSize: 15,
    fontWeight: "900",
  },
  backButton: {
    paddingVertical: 10,
  },
  backText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "800",
  },
});