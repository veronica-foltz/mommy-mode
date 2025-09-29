import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { db } from "../../firebase"; // if firebase.ts is at project root, use "../../firebase"
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

type EventRow = { id: string; title: string; date: string };
type MealRow  = { id: string; date: string; meal: string };

export default function TodayScreen() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [meals, setMeals]   = useState<MealRow[]>([]);

  useEffect(() => {
    const q1 = query(collection(db, "events"), orderBy("createdAt", "desc"), limit(5));
    const q2 = query(collection(db, "mealPlans"), orderBy("createdAt", "desc"), limit(5));

    const off1 = onSnapshot(q1, snap =>
      setEvents(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<EventRow,"id">) })))
    );
    const off2 = onSnapshot(q2, snap =>
      setMeals(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<MealRow,"id">) })))
    );

    return () => { off1(); off2(); };
  }, []);

  const renderEvent = ({ item }: { item: EventRow }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSub}>{item.date}</Text>
    </View>
  );

  const renderMeal = ({ item }: { item: MealRow }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.meal}</Text>
      <Text style={styles.cardSub}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.flex}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <FlatList
            data={events}
            keyExtractor={(i) => i.id}
            renderItem={renderEvent}
            contentContainerStyle={styles.listPad}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Plans</Text>
          <FlatList
            data={meals}
            keyExtractor={(i) => i.id}
            renderItem={renderMeal}
            contentContainerStyle={styles.listPad}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  listPad: { paddingBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSub: { color: "#6b7280", marginTop: 2 },
});