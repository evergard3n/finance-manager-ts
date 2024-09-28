import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface DocumentToUpload {
    
    name: string,
    price: string,
    exp: string,
}

export const addDocument = async (data: any, targetCollection: string) => {
    // const docRef = await addDoc(collection(db, targetCollection), data);
    const colRef = collection(db, targetCollection);
    await setDoc(doc(colRef, data.id), data);
    
};
export const updateDocument = async (data: any, targetCollection: string) => {
    const docRef = doc(db, targetCollection, data.id);
    await updateDoc(docRef, data);
};
export const deleteDocument = async (data: any, targetCollection: string) => {
    await deleteDoc(doc(db, targetCollection, data.id));
}
