import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
    apiKey: VUE_APP_FIREBASE_API_KEY,
    authDomain: VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: VUE_APP_FIREBASE_APP_ID,
    measurementId: VUE_APP_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener una instancia de Firestore
const db = getFirestore(app);

// Exportar `db` y funciones de Firestore
export { db, collection, addDoc, getDocs };
