import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

const API_URL = "http://192.168.65.19:8000";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export default function AssistantScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Hello! I'm your Crop Doctor AI assistant.\n\nAsk me anything about crop diseases, symptoms, treatment or prevention.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || message).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: data.reply || "Sorry, I couldn't process that request.",
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "⚠️ Connection failed. Please make sure your server is running and connected to the same network.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiIcon}>
          <Text style={styles.aiEmoji}>🤖</Text>
        </View>

        <View>
          <Text style={styles.title}>AI Assistant</Text>
          <Text style={styles.subtitle}>Your crop health companion</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={msg.sender === "user" ? styles.userMessage : styles.botMessage}
          >
            <Text style={msg.sender === "user" ? styles.userText : styles.botText}>
              {msg.text}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color="#2E7D32" />
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}

        {messages.length === 1 && (
          <>
            <Text style={styles.sectionTitle}>Try asking</Text>

            <View style={styles.suggestions}>
              <Pressable
                style={styles.suggestion}
                onPress={() => sendMessage("What are the symptoms of tomato diseases?")}
              >
                <Text style={styles.suggestionIcon}>🍅</Text>
                <Text style={styles.suggestionText}>
                  Tomato disease symptoms
                </Text>
              </Pressable>

              <Pressable
                style={styles.suggestion}
                onPress={() => sendMessage("How can I prevent crop diseases?")}
              >
                <Text style={styles.suggestionIcon}>🌱</Text>
                <Text style={styles.suggestionText}>
                  How to prevent diseases?
                </Text>
              </Pressable>

              <Pressable
                style={styles.suggestion}
                onPress={() => sendMessage("How should I treat an infected plant?")}
              >
                <Text style={styles.suggestionIcon}>💊</Text>
                <Text style={styles.suggestionText}>
                  Treatment advice
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ask about your crop..."
          placeholderTextColor="#89958B"
          style={styles.input}
          multiline
        />

        <Pressable
          style={[
            styles.sendButton,
            (!message.trim() || loading) && styles.sendButtonDisabled,
          ]}
          onPress={() => sendMessage()}
          disabled={!message.trim() || loading}
        >
          <Text style={styles.sendText}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F8F3",
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EAF0E9",
  },

  aiIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E5F2E3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  aiEmoji: {
    fontSize: 27,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#19351F",
  },

  subtitle: {
    fontSize: 13,
    color: "#78847B",
    marginTop: 3,
  },

  chat: {
    flex: 1,
  },

  chatContent: {
    padding: 20,
    paddingBottom: 25,
  },

  botMessage: {
    backgroundColor: "white",
    borderRadius: 18,
    borderTopLeftRadius: 5,
    padding: 16,
    marginBottom: 14,
    alignSelf: "flex-start",
    maxWidth: "85%",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },

  botText: {
    fontSize: 15,
    color: "#354339",
    lineHeight: 22,
  },

  userMessage: {
    backgroundColor: "#2E7D32",
    borderRadius: 18,
    borderTopRightRadius: 5,
    padding: 16,
    marginBottom: 14,
    alignSelf: "flex-end",
    maxWidth: "85%",
  },

  userText: {
    fontSize: 15,
    color: "white",
    lineHeight: 22,
  },

  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 18,
    borderTopLeftRadius: 5,
    padding: 12,
    marginBottom: 14,
    alignSelf: "flex-start",
  },

  loadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#78847B",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#25382A",
    marginTop: 10,
    marginBottom: 12,
  },

  suggestions: {
    gap: 10,
  },

  suggestion: {
    backgroundColor: "#EAF3E8",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  suggestionIcon: {
    fontSize: 23,
    marginRight: 12,
  },

  suggestionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#38513D",
    flex: 1,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5EAE5",
  },

  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 100,
    backgroundColor: "#F1F5F0",
    borderRadius: 23,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: "#26352A",
    marginRight: 9,
  },

  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },

  sendText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});