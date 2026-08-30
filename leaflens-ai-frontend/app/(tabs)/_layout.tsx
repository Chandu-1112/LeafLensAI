import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
  screenOptions={{
    headerShown: false,

    tabBarActiveTintColor: "#2E7D32",
    tabBarInactiveTintColor: "#8A948C",

    tabBarStyle: {
      height: 75,
      paddingTop: 4,
      paddingBottom: 14,
      backgroundColor: "#FFFFFF",
      borderTopWidth: 0,
      elevation: 8,
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },

    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "600",
      marginTop: -2,
    },
  }}
>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 23, color }}>
              🏠
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 23, color }}>
              📋
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="assistant"
        options={{
          title: "Assistant",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 23, color }}>
              💬
            </Text>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 23, color }}>
              👤
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
