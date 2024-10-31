import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
    apiKey: env.VUE_APP_FIREBASE_API_KEY,
    authDomain: env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VUE_APP_FIREBASE_APP_ID,
    measurementId: env.VUE_APP_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener una instancia de Firestore
const db = getFirestore(app);

// Exportar `db` y funciones de Firestore
export { db, collection, addDoc, getDocs };
