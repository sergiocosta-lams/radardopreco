import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBfUEiZunm55dMkLJDJv9-2mTL0z8bf9uA",
    authDomain: "radar-do-preco.firebaseapp.com",
    projectId: "radar-do-preco",
    storageBucket: "radar-do-preco.firebasestorage.app",
    messagingSenderId: "424082578630",
    appId: "1:424082578630:web:44eb717b1d097d4cef0bc7"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };