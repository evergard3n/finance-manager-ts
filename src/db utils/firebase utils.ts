import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export interface DocumentToUpload {
    
    name: string,
    price: string,
    exp: string,
}

export const addDocument = async (data: any, targetCollection: string) => {
    const docRef = await addDoc(collection(db, targetCollection), data);
    console.log("Document written with ID: ", docRef.id);
};
