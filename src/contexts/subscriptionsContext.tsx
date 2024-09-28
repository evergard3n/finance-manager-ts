import React, { createContext, useEffect, useState } from "react";
import { Subscriptions } from "../routes/subscriptions";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const SubscriptionsContext = createContext<Subscriptions[]>([]);

export const SubscriptionsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [subscriptions, setSubscriptions] = useState<Subscriptions[]>([]);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "subscriptions"), (querySnapshot) => {
            let subs: Subscriptions[] = [];
            querySnapshot.forEach((doc) => {
                subs.push(doc.data() as Subscriptions)
            })
            setSubscriptions(subs)
            
            
        })
        return unsubscribe; 
    },[])
    return (
        <SubscriptionsContext.Provider value={subscriptions}>
            {children}
        </SubscriptionsContext.Provider>
    )
}