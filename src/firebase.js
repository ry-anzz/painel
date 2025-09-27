// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Coloque as configurações do seu Firebase aqui
const firebaseConfig = {
    apiKey: "AIzaSyCksakM7R92X8OqswRP-i6_g-8lyinIhog",
    authDomain: "nota-2f865.firebaseapp.com",
    projectId: "nota-2f865",
    storageBucket: "nota-2f865.firebasestorage.app",
    messagingSenderId: "469654256985",
    appId: "1:469654256985:web:d71ac96ef0d6b642abe048",
    measurementId: "G-JC6XH9YW6C"
  };

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Obter a instância do Firestore
const db = getFirestore(app);

export { db };
