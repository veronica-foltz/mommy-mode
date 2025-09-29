import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYb8FsRVnaxlw43ASTojQkzWU7xqPi9IA",
  authDomain: "mommy-mode.firebaseapp.com",
  projectId: "mommy-mode",
  storageBucket: "mommy-mode.appspot.com",
  messagingSenderId: "235696998199",
  appId: "1:235696998199:web:8497ace96fbfe664073cb2",
  measurementId: "G-KYXJFWQEW2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// quick auto-login so reads/writes work
export async function ensureAuth() {
  try { await signInAnonymously(auth); } catch (e) { console.log(e); }
}