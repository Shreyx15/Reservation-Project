import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const handleGoogleLogin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await signInWithPopup(auth, provider);
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
}

const getToken = async () => {
    const token = await auth.currentUser.getIdToken(true);
    return token;
}

const verifyFirebaseToken = async () => {
    const token = await auth.currentUser.getIdToken(true);

    const res = await axios.post('/auth/checkAuthentication', { token, isGoogleLogin: true });
    const { data } = res;

    return data.isLoggedIn;
}

const handleFirebaseLogout = (dispatch) => {
    signOut(auth)
        .then(async () => {
            const token = localStorage.getItem('token');
            const res = await axios.post("/auth/logout", { token, isGoogleLogin: true });
            const { status } = res;
            if (status === 200) {
                const action = {
                    type: "LOGOUT"
                };
                dispatch(action);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

export { handleGoogleLogin, verifyFirebaseToken, handleFirebaseLogout, getToken };