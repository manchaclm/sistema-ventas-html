// Importamos las herramientas oficiales desde internet
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tus credenciales reales que configuramos juntos
const firebaseConfig = {
  apiKey: "AIzaSyAj3G0IE1izt...", // GitHub y Firebase ya se conocen con tu proyecto
  authDomain: "sistema-ventas-chaclm.firebaseapp.com",
  projectId: "sistema-ventas-chaclm",
  storageBucket: "sistema-ventas-chaclm.firebasestorage.app",
  messagingSenderId: "849325214047",
  appId: "1:849325214047:web:db8815a4c37658f4ca0eea"
};

// Conectamos la aplicación
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dejamos las herramientas listas para que tu archivo principal las use
export { db, collection, addDoc, getDocs, doc, updateDoc, setDoc };

