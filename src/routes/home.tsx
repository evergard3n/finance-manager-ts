
import { FormEvent, useEffect, useContext, useState } from "react"
import { SubscriptionsContext } from "../contexts/subscriptionsContext"
import { addDocument } from "../db utils/firebase utils"
import { toast } from "sonner"
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom"


import { formatDistanceStrict } from "date-fns";
import { Link } from "react-router-dom";


import { TopBar } from "../components/topBar";
import { TodosContext } from "../contexts/todoContext";
import {Button} from "../components/button"
import { Subscriptions } from "./subscriptions"
import { Todo, TodoGroup } from "./toDoList";
import { todoArraySorter } from "../db utils/general utils";

const SingleSubTracker: React.FC<{sub: Subscriptions}> = ({sub}) => {
    return (
        <div className="w-full h-20 bg-white border border-slate-150  mb-2 flex flex-row items-center justify-start gap-8 px-8 rounded-lg transition-all duration-500 ease-in-out">
            <i className="fa-solid fa-book scale-150"></i>
            <div>
                <p>{sub.name}</p>
                <p>{formatDistanceStrict(new Date(sub.date), new Date(Date.now())) + ' left'}</p>
            </div>
        </div>
    )
}
const MiniSubTracker: React.FC = () => {
    const subs: Array<Subscriptions> = useContext(SubscriptionsContext)
    
    const subsItems = subs.map((sub) => <li key={sub.id} ><SingleSubTracker sub={sub} /></li>)
    return (
        <Link to={"/subscriptions"}>
        <div className="w-full h-fit bg-white rounded-lg border border-slate-150 hover:drop-shadow-md transition-all duration-500 ease-in-out">
            <h1 className="text-lg font-poppins text-slate-500 p-4">Subscriptions</h1>
            <ol className="grid grid-cols-2 gap-x-2 px-4 pb-2">
                { subs.length === 0 ? <p className="">You currently have no subscription.</p> : subsItems}
            </ol>
        </div>
        </Link>
    )
}
const TodosTracker: React.FC = () => {
    const todos: Array<Todo> = useContext(TodosContext)
    let todayTodos: Array<Todo> = todos.filter((todo) => {
        const currentDate = new Date(Date.now());
        const todoDate = new Date(todo.date);
        return todoDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0);
    })
    return (
        <Link to={"/todo"} className="hover:drop-shadow-md transition-all duration-500 ease-in-out">

            <TodoGroup group={todoArraySorter(todayTodos)} title="Today's To-dos" />
        </Link>
    )
}
export default function Home() {
    
    return (
        <div className="relative w-full px-4 flex flex-col gap-6 border-l border-slate-100 h-lvh bg-repeat py-2">
            <TopBar title="Dashboard" synopsis="Welcome back, shiorin. What do you want to track today?"/>
            <div className="grid grid-cols-2 gap-4">
            <MiniSubTracker/>
            <TodosTracker/>
            </div>
        </div>
    )
}