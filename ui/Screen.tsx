import { View, ScrollView } from "react-native";

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 py-4">{children}</View>
    </ScrollView>
  );
}