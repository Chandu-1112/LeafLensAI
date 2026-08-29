import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { useState } from "react";

export default function ProfileScreen() {
  const [name, setName] = useState("Chandu");
  const [tempName, setTempName] = useState("Chandu");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenEdit = () => {
    setTempName(name);
    setIsModalVisible(true);
  };

  const handleSaveName = () => {
    if (tempName.trim().length > 0) {
      setName(tempName.trim());
    }
    setIsModalVisible(false);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>
        Manage your Crop Doctor account
      </Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👨‍🌾</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>
            Welcome to Crop Doctor
          </Text>
        </View>

        <Pressable style={styles.editButton} onPress={handleOpenEdit}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      {/* Account */}
      <Text style={styles.sectionTitle}>Account</Text>

      <View style={styles.menuCard}>
        <Pressable style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Text>👤</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Personal Information</Text>
            <Text style={styles.menuSubtitle}>
              Manage your profile details
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Text>🌐</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Language</Text>
            <Text style={styles.menuSubtitle}>
              English
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* Preferences */}
      <Text style={styles.sectionTitle}>Preferences</Text>

      <View style={styles.menuCard}>
        <Pressable style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Text>🔔</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Notifications</Text>
            <Text style={styles.menuSubtitle}>
              Diagnosis and crop health alerts
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Text>ℹ️</Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>About Crop Doctor</Text>
            <Text style={styles.menuSubtitle}>
              Version 1.0.0
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable style={styles.logoutButton}>
        <Text style={styles.logoutText}>🚪 Log Out</Text>
      </Pressable>

      <Text style={styles.footer}>
        Crop Doctor 🌱{"\n"}
        Intelligent crop health companion
      </Text>

      {/* Edit Name Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>

            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter your name"
              placeholderTextColor="#A0AAA2"
              autoFocus
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveName}
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#19351F",
  },

  subtitle: {
    fontSize: 14,
    color: "#718075",
    marginTop: 5,
    marginBottom: 25,
  },

  profileCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#E5F2E3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  avatarText: {
    fontSize: 30,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#263A2A",
  },

  email: {
    fontSize: 12,
    color: "#78847B",
    marginTop: 4,
  },

  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#EAF3E8",
  },

  editText: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#25382A",
    marginBottom: 12,
  },

  menuCard: {
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 25,
  },

  menuItem: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F0F5EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2B3D30",
  },

  menuSubtitle: {
    fontSize: 12,
    color: "#7B877E",
    marginTop: 3,
  },

  arrow: {
    fontSize: 28,
    color: "#A0AAA2",
    marginLeft: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEF1EE",
  },

  logoutButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#FDECEC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  logoutText: {
    color: "#C62828",
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: "#8A958C",
    fontSize: 12,
    lineHeight: 19,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 22,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#19351F",
    marginBottom: 16,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E8DF",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#263A2A",
    backgroundColor: "#F9FBF9",
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginLeft: 10,
  },

  cancelButton: {
    backgroundColor: "#F0F3F0",
  },

  cancelText: {
    color: "#606D63",
    fontWeight: "700",
    fontSize: 14,
  },

  saveButton: {
    backgroundColor: "#2E7D32",
  },

  saveText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});