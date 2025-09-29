import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarShowLabel: true,               // show labels to be sure
        tabBarActiveTintColor: "#7f86e5",
        tabBarInactiveTintColor: "#7b7b8b",
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            today: "today-outline",
            calendar: "calendar-outline",
            meals: "restaurant-outline",
            grocery: "cart-outline",
          };
          return <Ionicons name={map[route.name] || "ellipse-outline"} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="today" options={{ title: "Today" }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
      <Tabs.Screen name="meals" options={{ title: "Meals" }} />
      <Tabs.Screen name="grocery" options={{ title: "Grocery" }} />
    </Tabs>
  );
}