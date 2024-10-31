// firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

// Configuración de Firebase usando valores de entorno directamente
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "defaultKey",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "defaultDomain",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "defaultProject",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "defaultBucket",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "defaultSenderId",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "defaultAppId",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "defaultMeasurementId"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar `db` y funciones de Firestore
const db = getFirestore(app);
export { db, collection, addDoc, getDocs };
