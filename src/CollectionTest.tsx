import { useEffect, useState } from "react";
import { db } from "./firebase"
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { addDocument, DocumentToUpload } from "./db utils/firebase utils";
export default function CollectionTest() {
    const [data, setData] = useState<{ id: string }[]>([]);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "shopping-cart"), (querySnapshot) => {
            const docList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setData(docList);
        })
        return unsubscribe;
    }, [])
    function handleClick() {
        addDocument({name: '1', price: '2', url: '3', urgency: '4'}, 'shopping-cart');
        console.log(data);
        
    }   
    return (
        <div>
            <h1>Collection Test</h1>
            <ul>
                {data.map(item => <li key={item.id}>{JSON.stringify(item)}</li>)}
            </ul>
            <button onClick={handleClick}>Add</button>
        </div>
    )
}