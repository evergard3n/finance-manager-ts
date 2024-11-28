import React, {useState, useContext, FormEvent} from "react"
import { TopBar } from "../components/topBar"
import { TodosContext, } from "../contexts/todoContext"
import ReactDOM from "react-dom"
import { addDocument, updateDocument } from "../db utils/firebase utils"
import DatePicker from "react-datepicker"
import { toast } from "sonner"
import { format, compareAsc, formatDistance } from 'date-fns'

import { todoArraySorter } from "../db utils/general utils"
export interface Todo {
    task: string,
    date: string,
    id: string,
    completed: boolean,
    details: string
}
const SingleTodo: React.FC<{ todo: Todo }> = ({ todo }) => {
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        updateDocument({ ...todo, completed: e.target.checked }, 'todo');
    }
    let formattedDate: string;
    let outdated:boolean =false;
    let distance:string = '';
    if(todo.date === '') {
        formattedDate = '';
    } else {
        formattedDate = format(new Date(todo.date), 'dd/MM/yyyy');
        const currentDate = new Date(Date.now());
        const todoDate = new Date(todo.date);
        outdated = currentDate > todoDate;
        distance = formatDistance(currentDate, todoDate)
    }
    let outdatedDate: React.ReactNode = (
        <div className="text-orange-400 border rounded-full w-1/2 text-center text-xs font-bold py-1">
            {distance} ago
        </div>
    )
    
    return (
        <li key={todo.id}>
            <div className="flex flex-row justify-center items-baseline gap-2 pl-4">
                <input type="checkbox" name="done?" id="" className="rounded-full" onChange={handleToggle} checked={todo.completed}/>
                <div className="flex flex-col  w-full py-2 mb-2  bg-white  transition-all duration-150 ease-in-out font-poppins">
                    <p className={`text-lg ${todo.completed && 'line-through'}`}>{todo.task}</p>
                    {todo.details && <p className="text-sm text-slate-500">{todo.details}</p>}
                    <p className="text-sm text-slate-500">{formattedDate === '' ? '' : outdated ? outdatedDate : `Due: ${formattedDate}`}</p>

                </div>
            </div>
        </li>
    )
}
export const TodoGroup: React.FC<{ group: Array<Todo>, title: string }> = ({ group, title }) => {
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>, todo: Todo) => {
        e.preventDefault();
        updateDocument({ ...todo, completed: false }, 'todo');
    }
   const [showCompleted, setShowCompleted] = useState<boolean>(false);
   let listNotCompleted: Array<React.ReactNode> = group.map((todo) => { 
    if(!todo.completed) 
        return <li key={todo.id}><SingleTodo todo={todo} /></li>})
    const listCompleted: Array<React.ReactNode> = group.map((todo) => {
        if (todo.completed)
            return (
                <div className="flex flex-row px-4 gap-2">
                    <input type="checkbox" name="done?" id="" className="rounded-full" onChange={(e) => handleToggle(e, todo)} checked={todo.completed}/>
                    <p className="line-through">{todo.task}</p>
                </div>)
    })
    let completedBlock = (
        <div>
                <button onClick={() => setShowCompleted(!showCompleted)} className="w-full text-sm p-4 font-poppins text-slate-500">
                    <div className="flex flex-row justify-between">
                        <p>Completed</p>
                        {showCompleted ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                    </div>
                </button>
                {showCompleted && (<ol className="mb-4">{listCompleted}</ol>)}
            </div>
    )
    return (
        <div className="w-full border border-slate-200 rounded-lg bg-white h-fit transition-all ease-in-out">
            <div className="flex flex-row items-center justify-between my-4 px-4">
                <h1 className="text-lg font-poppins text-slate-500">{title}</h1>
                <p>{group.length}</p>
            </div>
            {group.length > 0 ? <ol>{listNotCompleted}</ol> : <p className="px-4">No todos today.</p>}
            {completedBlock}
            
        </div>
    )
}
const Todos: React.FC = () => {
    const todos = useContext(TodosContext);
    
    
    let todayTodos: Array<Todo> = todos.filter((todo) => {
        const currentDate = new Date(Date.now());
        const todoDate = new Date(todo.date);
        return todoDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0);
    })
    let undatedTodos: Array<Todo> = todos.filter((todo) => {
        return todo.date === '';
    })
    let futureTodos: Array<Todo> = todos.filter((todo) => {
        const currentDate = new Date(Date.now());
        const todoDate = new Date(todo.date);
        return todoDate.setHours(0, 0, 0, 0) > currentDate.setHours(0, 0, 0, 0);
    })
    let outdatedTodos: Array<Todo> = todos.filter((todo)=>{
        
        const currentDate = new Date(Date.now());
        const todoDate = new Date(todo.date);
        return todoDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0);
    })
    return (
        <div className="w-full grid grid-cols-4 gap-4">
            <TodoGroup group={undatedTodos} title="Undated To-dos" />
            <TodoGroup group={todoArraySorter(todayTodos)} title="Today's To-dos" />
            <TodoGroup group={todoArraySorter(futureTodos)} title="Future To-dos" />

            <TodoGroup group={todoArraySorter(outdatedTodos)} title="Outdated To-dos" />
        </div>
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
    const [selectedDate, setSelectedDate] = useState<boolean>(false);
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        if (!newTodo.task) {
            toast.warning("Please fill in all the fields", { position: 'top-center' });
            e.preventDefault();
            return
        }
        e.preventDefault();
        setNewTodoFalse();
        let selectDate : string;
        if(selectedDate){
            selectDate = date.toISOString();
        } else {
            selectDate = '';
        }
        addDocument({...newTodo, date: selectDate, id: Date.now().toString()}, 'todo');
    }
    const handleSubmitDate = () => {
        setSelectedDate(true);
        setAddDate(false);
    }
    const handleCancleDate = () => {
        setAddDate(false);
        setSelectedDate(false);
    }
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <div className="relative bg-white flex flex-col w-1/3 h-auto py-2 px-4 rounded-md">
                <form action="" onSubmit={onSubmit} className="flex flex-col gap-2 pt-2">
                    <div className="flex flex-row gap-4">
                        <input type="text" value={newTodo.task} onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })} placeholder="New task" className="font-poppins text-lg w-full flex-1 focus:outline-none" />
                        <button onClick={setNewTodoFalse}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    <textarea value={newTodo.details} onChange={(e) => setNewTodo({ ...newTodo, details: e.target.value })} placeholder="Details..." className="font-poppins text-md w-full h-24 focus:outline-none resize-none" />
                    <div className="flex flex-row">
                        {!addDate && <button onClick={() => setAddDate(true)} className="w-auto"><i className="fa-solid fa-calendar-days" title="Add date"></i></button>}
                        {addDate &&
                            <div className="">
                                <DatePicker selected={date} onChange={(date: Date | null) => setDate(date as Date)} className="w-fit px-3 py-2 border rounded-md border-slate:300 mt-1 text-center" />
                                <button className="px-3 py-2 rounded-md bg-slate-300 ml-2" onClick={handleSubmitDate}>Apply</button>
                                <button className="px-3 py-2 rounded-md bg-slate-300 ml-2" onClick={handleCancleDate}>Cancel</button>
                            </div>}
                        {
                            selectedDate && !addDate ? (
                                <p className="ml-2 border border-black px-2 rounded-full">{format(date, 'dd/MM/yyyy')}</p>
                            ) : null
                        }
                    </div>
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