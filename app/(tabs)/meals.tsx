import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { db } from "../../firebase"; // ← if firebase.ts is at project root, use "../../firebase"
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

type MealRow = { id: string; date: string; meal: string };

export default function MealsScreen() {
  const [date, setDate] = useState("");
  const [meal, setMeal] = useState("");
  const [plans, setPlans] = useState<MealRow[]>([]);

  useEffect(() => {
    const q = query(collection(db, "mealPlans"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows: MealRow[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<MealRow, "id">),
      }));
      setPlans(rows);
    });
    return () => unsub();
  }, []);

  async function addPlan() {
    if (!date || !meal) {
      Alert.alert("Missing info", "Please enter a date and a meal.");
      return;
    }
    try {
      await addDoc(collection(db, "mealPlans"), {
        date,
        meal,
        createdAt: serverTimestamp(),
      });
      setDate("");
      setMeal("");
    } catch (e: any) {
      Alert.alert("Plan dinner failed", e?.message ?? String(e));
      console.log("Plan dinner failed:", e);
    }
  }

  const renderItem = ({ item }: { item: MealRow }) => (
    <View style={styles.card}>
      <Text style={styles.itemTitle}>{item.meal}</Text>
      <Text style={styles.itemSub}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Text style={styles.screenTitle}>Meals</Text>
          <View style={styles.card}>
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />
            <TextInput
              placeholder="Dinner (e.g., Chicken Tacos)"
              value={meal}
              onChangeText={setMeal}
              style={styles.input}
            />
            <Button title="Plan Dinner" onPress={addPlan} />
          </View>
        </View>

        <FlatList
          data={plans}
          keyExtractor={(i) => i.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listPad}
          renderItem={renderItem}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  container: { paddingHorizontal: 16, paddingTop: 12 },
  screenTitle: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  listPad: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  itemSub: { color: "#6b7280", marginTop: 2 },
});