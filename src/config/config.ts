export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDm4e1WgzAqEeoadjoxogBt4ULKKp1nvvA",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hypothesize-game.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hypothesize-game",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hypothesize-game.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "923641051396",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:923641051396:web:505f31ed8a76bee4883851",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-63MK7DR11P"
};