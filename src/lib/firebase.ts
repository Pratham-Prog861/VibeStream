// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6Bs2iapmthw7ydY1XQntV0cx0PaAJ1gM",
  authDomain: "vibestream-jqezr.firebaseapp.com",
  projectId: "vibestream-jqezr",
  storageBucket: "vibestream-jqezr.appspot.com",
  messagingSenderId: "403341082245",
  appId: "1:403341082245:web:01550a3dff26646c0573ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
