import { compareAsc } from "date-fns";
import { Todo } from "../routes/toDoList";
export const todoArraySorter = (todos: Todo[]) => {
    const sortedTodos = todos.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return compareAsc(dateA, dateB);
    });
    return sortedTodos
}