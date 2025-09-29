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
import { db } from "../../firebase"; // ← if your firebase file is inside /app, change to "../firebase"
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

type EventRow = { id: string; title: string; date: string };

export default function CalendarScreen() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [events, setEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows: EventRow[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<EventRow, "id">),
      }));
      setEvents(rows);
    });
    return () => unsub();
  }, []);

  async function addEvent() {
    if (!title || !date) {
      Alert.alert("Missing info", "Please enter both a title and a date (YYYY-MM-DD).");
      return;
    }
    try {
      await addDoc(collection(db, "events"), {
        title,
        date,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setDate("");
    } catch (e: any) {
      Alert.alert("Add event failed", e?.message ?? String(e));
      console.log("Add event failed:", e);
    }
  }

  const renderItem = ({ item }: { item: EventRow }) => (
    <View style={styles.card}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemSub}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.flex}
      >
        {/* Top form */}
        <View style={styles.container}>
          <Text style={styles.screenTitle}>Calendar</Text>

          <View style={styles.card}>
            <TextInput
              placeholder="Event title (e.g., Soccer)"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />
            <Button title="Add Event" onPress={addEvent} />
          </View>
        </View>

        {/* The list is the only scroller (no ScrollView) */}
        <FlatList
          data={events}
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