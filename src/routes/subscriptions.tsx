
import React, { FormEvent, useContext, useEffect, useState } from "react"
import { SubscriptionsContext } from "../contexts/subscriptionsContext"
import ReactDOM from "react-dom"
import { toast } from "sonner"
import { Button } from "../components/button"
import { addDocument, deleteDocument, updateDocument } from "../db utils/firebase utils"
import { TopBar } from "../components/topBar"

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { newDate } from "react-datepicker/dist/date_utils"

import { format } from 'date-fns'

import _ from 'lodash'

export interface Subscriptions {
    id: string,
    name: string,
    date: string,
    price: string
}

const SingleSubscription: React.FC<{ sub: Subscriptions }> = ({ sub }) => {
    const [showInfo, setShowInfo] = useState<boolean>(false)
    function setShowInfoFalse(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        setShowInfo(false)
    }
    return (
        <div className="flex flex-row  w-full border-t py-2 border-slate-300 bg-white hover:bg-slate-100 transition-all duration-150 ease-in-out" onClick={() => { setShowInfo(true) }}>
            <p className="flex-[3] border-r">{sub.name}</p>
            <p className="flex-[1] border-r text-right pr-4 ">{sub.price}</p>
            <p className="flex-[1] border-r text-right pr-3">{format(new Date(sub.date), 'dd/MM/yyyy')}</p>
            <button className="px-3"><i className="fa-regular fa-pen-to-square"></i></button>
            {showInfo && <SingleSubscriptionInfo sub={sub} func={setShowInfoFalse} />}
        </div>
    )
}

const SingleSubscriptionInfo: React.FC<{ sub: Subscriptions, func: (e: React.MouseEvent<HTMLButtonElement>) => void }> = ({ sub, func }) => {
    const [currSub, setCurrSub] = useState<Subscriptions>(sub)
    const [editing, setEditing] = useState<boolean>(false)
    const [date, setDate] = useState<Date>(new Date())
    const update = async () => {
        try {
            updateDocument(currSub, 'subscriptions')
            
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };
    const deleteSub = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            e.preventDefault()
            deleteDocument(currSub, 'subscriptions')
            toast.success('Subscription deleted!', { position: 'top-center' })
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };
    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(_.isEqual(sub, currSub)) {
            setEditing(false);
        } else {
            update();
            setEditing(false);
            toast.success('Subscription edited!', { position: 'top-center' })
        }
    }
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="relative bg-white flex flex-col w-1/3 h-auto py-2 px-4 rounded-md gap-4">
                <div className="flex flex-row">
                    <h1 className="font-poppins w-full  py-2 text-lg">{sub.name}</h1>
                    <button onClick={func}><i className="fa-regular fa-circle-xmark"></i></button>
                </div>
                <div>
                    <h2>Price:</h2>
                    {editing ? <input type="text" className="px-3 py-2 border rounded-md border-slate-300 mt-1" value={currSub.price} onChange={(e) => setCurrSub({ ...currSub, price: e.target.value })} /> : <p className="text-xl">{currSub.price}</p>}
                </div>
                <div>
                    <h2>Expiry:</h2>
                    {editing ? <div className="w-1/2 px-3 py-2 border rounded-md border-slate:300 mt-1">
                    <DatePicker
                        selected={date}
                        onChange={(date: Date | null) => { setDate(date as Date); setCurrSub({ ...currSub, date: date?.toISOString() as string }) }}
                    /></div> 
                    : <p className="text-xl">{format(new Date(currSub.date), 'dd/MM/yyyy')}</p>}
                </div>
                <div className="flex flex-row items-center justify-start pt-4 -ml-2">
                    { editing ? 
                    <button 
                        className="text-sm text-gray-500 font-poppins hover:bg-slate-100 p-2 rounded-lg transition-colors duration-300 ease-in-out w-24 flex flex-row   justify-start items-center gap-1" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { handleSave(e) }}>
                            <i className="fa-solid fa-floppy-disk"></i>Save
                    </button> : 
                    <Button onClick={() => { setEditing(true) }}>
                        <i className="fa-solid fa-pen-to-square"></i>Edit
                    </Button>}
                    <button 
                        className="text-sm text-gray-500 font-poppins hover:bg-slate-100 p-2 rounded-lg transition-colors duration-300 ease-in-out w-24 flex flex-row justify-start items-center gap-1" 
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { deleteSub(e) }}>
                            <i className="fa-solid fa-trash"></i>Delete
                    </button>
                </div>
            </div>
        </div>, document.body
    )
}
function SubscriptionTracker() {
    const subs: Array<Subscriptions> = useContext(SubscriptionsContext)

    const [adding, setAdding] = useState<boolean>(false)

    function setAddingFalse() {
        setAdding(false);
    }
    let subscriptions = subs.map((sub) =>
        <li key={sub.id} className="">
            <SingleSubscription sub={sub} />
        </li>)
    return (
        <div className="relative bg-white w-full p-2 rounded-md font-[poppins] transition-all duration-200 ease-in-out">

            <div className="italic font-[poppins]   border-slate-300 mb-2 flex flex-row w-full">
                <p className="flex-[3]">Name</p>
                <p className="flex-[1] text-right pr-4">Price</p>
                <p className="flex-[1]  text-right pr-3">Expiry</p>
                {adding && <NewSubscription setAddingFalse={setAddingFalse} />}
                <button onClick={() => setAdding(true)} className="px-3"><i className="fa-solid fa-circle-plus"></i></button>
            </div>
            <ol>
                {subscriptions}

            </ol>




        </div>
    )
}
const NewSubscription: React.FC<{ setAddingFalse: () => void }> = ({ setAddingFalse }) => {
    const [newSub, setNewSub] = useState<Subscriptions>({ id: '', name: '', date: '', price: '' })
    const [newDate, setNewDate] = useState<Date>(new Date())
    const [months, setMonths] = useState<number>(0)
    function onSubmit(e: FormEvent<HTMLFormElement>) {
        if (!newSub.name || !newDate.toISOString() || !newSub.price) {
            toast.warning("Please fill in all the fields", { position: 'top-center' });
            e.preventDefault();
            return
        }
        e.preventDefault();
        const dateCal: Date = new Date(newDate.setMonth(newDate.getMonth() + months))
        addDocument({ ...newSub, id: Date.now().toString(), date: dateCal.toISOString() }, 'subscriptions');
        toast.success('Subscription added!', { position: 'top-center' })
        setNewSub({ id: '', name: '', date: '', price: '' })
        setAddingFalse()

    }
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="relative bg-white flex flex-col w-1/3 h-auto py-2 px-4 rounded-md">
                <h1 className="font-poppins w-full  py-2 text-lg">Create new subscription</h1>
                <form action="" onSubmit={onSubmit} className="flex flex-col gap-2 pt-2">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 " value={newSub.name} id="name" onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} />
                    <label htmlFor="price">Price</label>
                    <input type="text" className="px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500  " value={newSub.price} id="price" onChange={(e) => setNewSub({ ...newSub, price: e.target.value })} />
                    <label htmlFor="date">Start date</label>
                    {/* <input type="text" className="px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500  " value={newSub.date.toString()} id="date" onChange={(e) => setNewSub({ ...newSub, date: e.target.value })} /> */}
                    <div className="px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                    <DatePicker selected={newDate} onChange={(date: Date | null) => setNewDate(date as Date)} />
                    </div>
                    <label htmlFor="months">Duration (in months)</label>
                    <input type="text" className="px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500  " value={months} id="price" onChange={(e) => setMonths(+e.target.value)} />
                    
                    <div className="flex flex-row justify-start">
                        <Button onClick={() => { }}><i className="fa-solid fa-circle-plus"></i>Add</Button>
                        <Button onClick={setAddingFalse}><i className="fa-regular fa-circle-xmark"></i>Cancel</Button>
                    </div>
                </form>
            </div>

        </div>, document.body
    )
}
export default function Subscriptions() {
    const subscriptions = useContext(SubscriptionsContext)
    useEffect(() => {
        console.log(subscriptions);

    })
    return (
        <div className="relative w-full px-4 flex flex-col gap-6 border-l border-slate-100 h-lvh bg-repeat py-2">
            <TopBar title="Subscriptions" synopsis="Here are your subscriptions." />
            <SubscriptionTracker />
        </div>
    )
}