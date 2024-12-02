import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHZlKopio33uboF7pHviOzVa4PCfFTE0s",
  authDomain: "encontreaqui-ifpe.firebaseapp.com",
  projectId: "encontreaqui-ifpe",
  storageBucket: "encontreaqui-ifpe.firebasestorage.app",
  messagingSenderId: "243876383740",
  appId: "1:243876383740:web:438d29a34c6c9aab3ac079",
  measurementId: "G-D9GKP6RNBQ",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
