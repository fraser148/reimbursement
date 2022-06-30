// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail, 
  signOut} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfp3WVs-z_EjbTQHNn1tc4NgXiCHulHW0",
  authDomain: "tedxoxford-96eec.firebaseapp.com",
  projectId: "tedxoxford-96eec",
  storageBucket: "tedxoxford-96eec.appspot.com",
  messagingSenderId: "300122833533",
  appId: "1:300122833533:web:3a2e9fa4f5737675fc2714",
  measurementId: "G-S0DV9EZN3Z"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

const googleProvider = new GoogleAuthProvider();

export const signInGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    const { uid, name, email } = credential.user;
    setDoc(doc(db, "users", uid), {email, name}, {merge: true})
}

export const signInEmailPass = async (email, password) => {
    try {
        let okay = await signInWithEmailAndPassword(auth, email, password);
        console.log(okay)
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

export const registerEmailPass = async (name, email, password) => {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = credential.user
        setDoc(doc(db, "users", uid), {email, name})
        updateProfile(auth.currentUser, {
            displayName: name
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

export const PasswordResetEmail = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

export const signOutAcc = async () => {
    try {
        await signOut(auth);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}