// firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, collection, addDoc, doc, updateDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

// Configuración de Firebase usando valores de entorno directamente
const firebaseConfig = {
    apiKey: "AIzaSyC5zrYtcyYy8WsZDkNpjog7j_kwmK1vjsM",
    authDomain: "invitacion-ee4d6.firebaseapp.com",
    projectId: "invitacion-ee4d6",
    storageBucket: "invitacion-ee4d6.firebasestorage.app",
    messagingSenderId: "106937906898",
    appId: "1:106937906898:web:5147a99092531fe1825f0b",
    measurementId: "G-VNBFGTCXC0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar `db` y funciones de Firestore
const db = getFirestore(app);
export { db, collection, addDoc, doc, updateDoc, getDocs };
