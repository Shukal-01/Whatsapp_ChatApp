import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBjmPA2OerjwWpmU8h17aVNPRFkz6EPViY",
    authDomain: "whatsappclone-c59ce.firebaseapp.com",
    projectId: "whatsappclone-c59ce",
    storageBucket: "whatsappclone-c59ce.appspot.com",
    messagingSenderId: "94467007243",
    appId: "1:94467007243:web:50e42a9f2ee4c0081b380e",
    measurementId: "G-W5Y7FM0NS7"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);