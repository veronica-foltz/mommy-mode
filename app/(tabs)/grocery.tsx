import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Pressable,
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
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

type GroceryRow = { id: string; name: string; checked: boolean };

export default function GroceryScreen() {
  const [name, setName] = useState("");
  const [items, setItems] = useState<GroceryRow[]>([]);

  useEffect(() => {
    const q = query(collection(db, "groceries"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows: GroceryRow[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GroceryRow, "id">),
      }));
      setItems(rows);
    });
    return () => unsub();
  }, []);

  async function addItem() {
    if (!name) return;
    try {
      await addDoc(collection(db, "groceries"), {
        name,
        checked: false,
        createdAt: serverTimestamp(),
      });
      setName("");
    } catch (e: any) {
      Alert.alert("Add item failed", e?.message ?? String(e));
      console.log("Add item failed:", e);
    }
  }

  async function toggleItem(item: GroceryRow) {
    try {
      await updateDoc(doc(db, "groceries", item.id), { checked: !item.checked });
    } catch (e: any) {
      Alert.alert("Update failed", e?.message ?? String(e));
      console.log("Toggle item failed:", e);
    }
  }

  const renderItem = ({ item }: { item: GroceryRow }) => (
    <Pressable onPress={() => toggleItem(item)}>
      <View style={styles.cardRow}>
        <View
          style={[
            styles.checkbox,
            item.checked ? styles.checkboxOn : styles.checkboxOff,
          ]}
        />
        <Text style={[styles.itemText, item.checked && styles.itemTextDone]}>
          {item.name}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Text style={styles.screenTitle}>Grocery List</Text>
          <View style={styles.card}>
            <TextInput
              placeholder="Add item (e.g., Milk)"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Button title="Add" onPress={addItem} />
          </View>
        </View>

        <FlatList
          data={items}
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

  cardRow: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
  },
  checkboxOff: { borderColor: "#9ca3af" },
  checkboxOn: { borderColor: "#7f86e5", backgroundColor: "#7f86e5" },
  itemText: { fontSize: 16, color: "#111827" },
  itemTextDone: { textDecorationLine: "line-through", color: "#9ca3af" },
});