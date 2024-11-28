import CollectionTest from "./CollectionTest";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Cart from "./routes/cart";
import ErrorPage from "./routes/errorPage";
import Home from "./routes/home";
import { Toaster } from "sonner";
import Subscriptions from "./routes/subscriptions";
import { SubscriptionsProvider } from "./contexts/subscriptionsContext";
import { ToDoList } from "./routes/toDoList";
import { TodosProvider } from "./contexts/todoContext";
import { useEffect } from "react";
export default function App() {
  useEffect(()=>{
    console.log(import.meta.env);
  },[])
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root/>,
      errorElement: <ErrorPage/>,
      children: [
        {
          path: "/",
          element: <Home/>,
          
        },
        {
          path: "/test",
          element: <CollectionTest/>
        },
        {
          path: "/cart",
          element: <Cart/>
        },
        {
          path: "/subscriptions",
          element: <Subscriptions/>,
          
        },
        {
          path: "/todo",
          element: <ToDoList/>
        }

      ]
    }
  ]);
  
  return (
    <TodosProvider>
      <SubscriptionsProvider>
      <RouterProvider router={router} />
      <Toaster/>
    </SubscriptionsProvider>
    </TodosProvider>
  )
}