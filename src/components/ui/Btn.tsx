import { Pressable, Text } from "react-native";

export default function Btn({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="bg-brand-500 rounded-xl py-3 px-4 items-center my-2">
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  );
}