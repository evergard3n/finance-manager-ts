import { FirebaseApp, initializeApp } from 'firebase/app';
   import { Firestore, getFirestore } from 'firebase/firestore';
   import { Auth, getAuth } from 'firebase/auth';

   const firebaseConfig = {
    apiKey: "AIzaSyCf78vFFAnWaf39d-d4_jRgADv0HPPLtXQ",
    authDomain: "finance-manager-2417c.firebaseapp.com",
    projectId: "finance-manager-2417c",
    storageBucket: "finance-manager-2417c.appspot.com",
    messagingSenderId: "365150738900",
    appId: "1:365150738900:web:2936990693df7510895e41",
    measurementId: "G-DZ9G8W9FTL"
   };

   const app: FirebaseApp = initializeApp(firebaseConfig);
   const db: Firestore = getFirestore(app);
   const auth: Auth = getAuth(app);

   export { db, auth };