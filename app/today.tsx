import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { db } from "../firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function TodayScreen() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "today"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Today</Text>
      {items.map((item) => (
        <View key={item.id} style={{ padding: 8, borderBottomWidth: 1 }}>
          <Text>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}