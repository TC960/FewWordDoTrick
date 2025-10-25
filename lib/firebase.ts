// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAj0ODnGuI7oRp8lwb4xFF1SDVwjGsZZsg",
  authDomain: "neuroassist-ce609.firebaseapp.com",
  databaseURL: "https://neuroassist-ce609-default-rtdb.firebaseio.com",
  projectId: "neuroassist-ce609",
  storageBucket: "neuroassist-ce609.firebasestorage.app",
  messagingSenderId: "148909972997",
  appId: "1:148909972997:web:ac13877bc32283ff5f066c"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
