import React, {useState, useContext, FormEvent} from "react"
import { TopBar } from "../components/topBar"
import { TodosContext, } from "../contexts/todoContext"
import ReactDOM from "react-dom"
import { addDocument } from "../db utils/firebase utils"
import DatePicker from "react-datepicker"
import { toast } from "sonner"
export interface Todo {
    task: string,
    date: string,
    id: string,
    completed: boolean,
    details: string
}
const SingleTodo: React.FC<{todo: Todo}> = ({todo}) => {
    return (
        <li key={todo.id}>
            <div className="flex flex-row  w-full border-t py-2 border-slate-300 bg-white hover:bg-slate-100 transition-all duration-150 ease-in-out">
            <p>{todo.task}</p>
            <p>{todo.date}</p>
           
        </div>
        </li>
    )
}
const Todos: React.FC = () => {
    const todos = useContext(TodosContext);
    let todoList: Array<React.ReactNode> = todos.map((todo) => <SingleTodo todo={todo} />)
    return (
        <ul>
            {todoList}
        </ul>
    )
}
const TodoCreator: React.FC = () => {
    const [creating, setCreating] = useState<boolean>(false);
    const setNewTodoFalse = () => {
        setCreating(false);
    }
    
    return (
        <div>
            <button onClick={() => setCreating(true)} className="flex flex-row items-center gap-2 w-auto h-10 bg-slate-200 rounded-lg px-4"><i className="fa-solid fa-plus"></i>Create new todo</button>
            {creating && <TodoCreatorPortal setNewTodoFalse={setNewTodoFalse}/>}
        </div>
    )
}
const TodoCreatorPortal : React.FC<{setNewTodoFalse: () => void}> = ({setNewTodoFalse}) => {
    const [newTodo, setNewTodo] = useState<Todo>({task: '', details:"",date: '', id: '', completed: false});
    const [addDate, setAddDate] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(new Date());
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        if (!newTodo.task) {
            toast.warning("Please fill in all the fields", { position: 'top-center' });
            e.preventDefault();
            return
        }
        e.preventDefault();
        setNewTodoFalse();
        addDocument({...newTodo, date: date.toISOString(), id: Date.now().toString()}, 'todo');
    }
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="relative bg-white flex flex-col w-1/3 h-auto py-2 px-4 rounded-md">
                <form action="" onSubmit={onSubmit} className="flex flex-col gap-2 pt-2">
                    <div className="flex flex-row">
                        <input type="text" value={newTodo.task} onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })} placeholder="New task" className="font-poppins text-lg w-full flex-1 focus:outline-none" />
                        <button onClick={setNewTodoFalse}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    <textarea value={newTodo.details} onChange={(e) => setNewTodo({ ...newTodo, details: e.target.value })} placeholder="Details..." className="font-poppins text-md w-full h-24 focus:outline-none resize-none" />
                    {!addDate && <button onClick={() => setAddDate(true)} className="w-auto"><i className="fa-solid fa-calendar-days" title="Add date"></i></button>}
                    {addDate && 
                    <div className="">
                        <DatePicker selected={new Date()} onChange={(date: Date | null) => setDate(date as Date)} className="w-fit px-3 py-2 border rounded-md border-slate:300 mt-1 text-center" />
                        <button className="px-3 py-2 rounded-md bg-slate-300 ml-2" onClick={() => {setAddDate(false);}}>Cancel</button>
                    </div>}
                    <button><i className="fa-solid fa-plus"></i>Add</button>
                </form>
            </div>
        </div>, document.body
    )
}
export const ToDoList: React.FC = () => {
    return (
        <div className="relative w-full px-4 flex flex-col gap-6 border-l border-slate-100 h-lvh bg-repeat py-2">
            <TopBar title="To-do list" synopsis="What have you forgotten to do today?"/>
            <TodoCreator />
            <Todos />
        </div>
    )
}