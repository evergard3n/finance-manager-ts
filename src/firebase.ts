import { FirebaseApp, initializeApp } from 'firebase/app';
   import { Firestore, getFirestore } from 'firebase/firestore';
   import { Auth, getAuth } from 'firebase/auth';
import { config } from 'dotenv';

const envVar = import.meta.env;
const firebaseConfig = {
    apiKey: envVar.VITE_FIREBASE_APIKEY,
    authDomain: envVar.VITE_authDomain,
    projectId: envVar.VITE_projectId,
    storageBucket: envVar.storageBucket,
    messagingSenderId: envVar.messagingSenderId,
    appId: envVar.appId,
    measurementId: envVar.measurementId
   };

   const app: FirebaseApp = initializeApp(firebaseConfig);
   const db: Firestore = getFirestore(app);
   const auth: Auth = getAuth(app);


   export { db, auth };