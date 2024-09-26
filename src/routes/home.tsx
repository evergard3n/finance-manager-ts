import { collection, onSnapshot } from "firebase/firestore"
import { FormEvent, useEffect, useState } from "react"
import { db } from "../firebase"
import { addDocument } from "../db utils/firebase utils"
import { toast } from "sonner"
import "react-toastify/dist/ReactToastify.css";
interface Subscriptions {
    id: string
    name: string,
    date: string,
    price:string
}
const TopBar: React.FC = () => {
    return (
        <div className="border-b border-slate-300 pb-4 flex justify-between">
            <div>
            <h1 className="font-[poppins]  text-3xl">Dashboard</h1>
            <p>Welcome back, shiorin. What do you want to track today?</p>
            </div>
            <div className="rounded-full relative overflow-hidden w-16 h-16  border-pink-400 border-2">
                <img className=" absolute top-8 right-0 object-cover scale-[2]" src="\pfp.jpg" alt="" />
            </div>
        </div>
    )
}
const Button: React.FC<{children?: React.ReactNode, onClick: () => void}> = ({children, onClick}) => {
    if (children === null || children === undefined) {
        throw new Error("Button component's children prop is null or undefined");
    }
    if (typeof onClick !== "function") {
        throw new Error("Button component's onClick prop is not a function");
    }
    return (
        <button type="submit" className="text-sm text-gray-500 mt-1 hover:bg-slate-100 p-2 rounded-lg transition-colors duration-300 ease-in-out w-24 flex flex-row justify-start items-center gap-1" onClick={onClick}>{children}</button>
    )
}
function SubscriptionTracker() {
    const [subs, setSubs] = useState<Array<Subscriptions>>([])
    const [adding, setAdding] = useState<boolean>(false)
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "subscriptions"), (querySnapshot) => {
            const docList = querySnapshot.docs.map((doc) => 
                doc.data() as Subscriptions,
            )
            setSubs(docList);
        })
        return unsubscribe;
    }, [])
    function setAddingFalse() {
        setAdding(false);
    }
    let subscriptions = subs.map((sub) => 
    <li key={sub.id} className="border-t py-2 border-slate-300">
        <SingleSubscription name={sub.name} price={sub.price} exp={sub.date} />
    </li>)
    return (
        <div className="bg-white w-1/2 p-2 rounded-md font-[poppins] hover:drop-shadow-md transition-all duration-200 ease-in-out">
            <div className="text-left text-lg font-bold pb-2">
            <h1>Subscriptions</h1>
            </div>
            <div className="italic font-[poppins]   border-slate-300 mb-2 flex flex-row w-full">
                <p className="flex-[3] border-r">Name</p>
                <p className="flex-[1] border-r text-right pr-4">Price</p>
                <p className="flex-[1] border-r text-right pr-3">Expiry</p>
                <i className="fa-regular fa-pen-to-square px-3 text-white"></i>
            </div>
            <ol>
                {subscriptions}
            </ol>
            {adding? <NewSubscription setAddingFalse={setAddingFalse} /> : <Button onClick={() => setAdding(true)}><i className="fa-solid fa-circle-plus"></i>Add</Button>}
            
            
            
        </div>
    )
}
function SingleSubscription({name,price,exp}: {name: string,price: string,exp: string}) {
    return (
        <div className="flex flex-row  w-full border-slate-300">
            <p className="flex-[3] border-r">{name}</p>
            <p className="flex-[1] border-r text-right pr-4">{price}</p>
            <p className="flex-[1] border-r text-right pr-3">{exp}</p>
            <button className="px-3"><i className="fa-regular fa-pen-to-square"></i></button>
        </div>
    )
}
const NewSubscription: React.FC<{setAddingFalse: ()=> void}> = ({setAddingFalse}) => {
    const [newSub, setNewSub] = useState<Subscriptions>({id: '', name: '', date: '', price: ''})
    function onSubmit(e: FormEvent<HTMLFormElement>) {
        if(!newSub.name || !newSub.date || !newSub.price) {
            toast.warning("Please fill in all the fields", {position: 'top-center'});
            e.preventDefault();
            return
        }
        e.preventDefault();
        addDocument({...newSub, id: Date.now()}, 'subscriptions');
        toast.success('Subscription added!', {position: 'top-center'})
        setNewSub({id: '', name: '', date: '', price: ''})
    }
    return (
        <form action="" onSubmit={onSubmit} className="flex flex-col  border-t mt-4">
            <label htmlFor="name">Name</label>
            <input type="text" className="border rounded-md border-slate-300 flex-[3] bg-transparent" value={newSub.name} id="name" onChange={(e) => setNewSub({...newSub, name: e.target.value})}/>
            <label htmlFor="price">Price</label>
            <input type="text" className="border rounded-md border-slate-300 flex-[1]" value={newSub.price} id="price" onChange={(e) => setNewSub({...newSub, price: e.target.value})}/>
            <label htmlFor="date">Expiry</label>
            <input type="text" className="border rounded-md border-slate-300 flex-[1]" value={newSub.date} id="date" onChange={(e) => setNewSub({...newSub, date: e.target.value})}/>
            <div className="flex flex-row justify-start">
            <Button onClick={()=>{}}><i className="fa-solid fa-circle-plus"></i>Add</Button>
            <Button onClick={setAddingFalse}><i className="fa-regular fa-circle-xmark"></i>Cancel</Button>
            </div>
        </form>
    )
}
export default function Home() {
    return (
        <div className="w-full p-4 flex flex-col gap-6 bg-slate-100 h-dvh rounded-2xl my-2">
            <TopBar/>
            <SubscriptionTracker/>
        </div>
    )
}