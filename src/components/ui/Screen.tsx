import { ScrollView, View } from "react-native";

export default function Screen({
  children,
  scroll = true,
  className,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
}) {
  if (!scroll) {
    return <View className={`flex-1 bg-white dark:bg-neutral-950 ${className ?? ""}`}>{children}</View>;
  }
  return (
    <ScrollView className={`flex-1 bg-white dark:bg-neutral-950 ${className ?? ""}`}>
      <View className="px-5 py-4">{children}</View>
    </ScrollView>
  );
}