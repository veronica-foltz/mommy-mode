import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../src/theme/ThemeProvider";
import { StatusBar } from "expo-status-bar";

export default function Header() {
  const { theme, toggle } = useTheme();

  return (
    <View className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Ionicons
            name="heart"
            size={20}
            color={theme === "dark" ? "#fda4af" : "#e11d48"} // rose
          />
          <Text className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
            Mommy <Text className="text-brand-500">Mode</Text>
          </Text>
        </View>

        <Pressable
          onPress={toggle}
          accessibilityLabel="Toggle theme"
          className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"
        >
          <Ionicons
            name={theme === "dark" ? "sunny-outline" : "moon-outline"}
            size={20}
            color={theme === "dark" ? "#fde68a" : "#0ea5e9"}
          />
        </Pressable>
      </View>
    </View>
  );
}