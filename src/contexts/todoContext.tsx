import React, { createContext, useEffect, useState } from "react";
import { Todo } from "../routes/toDoList";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
export const TodosContext = createContext<Todo[]>([]);

export const TodosProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [todoList, setTodoList] = useState<Todo[]>([]);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "todo"), (querySnapshot) => {
            let todos: Todo[] = [];
            querySnapshot.forEach((doc) => {
                todos.push(doc.data() as Todo)
            })
           setTodoList(todos)
            
        })
        return unsubscribe; 
    },[])
    return (
        <TodosContext.Provider value={todoList}>
            {children}
        </TodosContext.Provider>
    )
}