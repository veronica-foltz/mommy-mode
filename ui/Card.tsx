import { View } from "react-native";

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 my-2" >
      {children}
    </View>
  );
}