/* ============================================================
   Pega aquí la configuración de TU proyecto de Firebase.
   Mientras diga TU_API_KEY la tienda funciona en modo ejemplo
   con productos de prueba que no se guardan.
   ============================================================ */
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

const FIREBASE_LISTO =
  typeof firebase !== "undefined" && firebaseConfig.apiKey !== "TU_API_KEY";

let auth = null;
let db = null;
if (FIREBASE_LISTO) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  if (typeof firebase.auth === "function") auth = firebase.auth();
}
