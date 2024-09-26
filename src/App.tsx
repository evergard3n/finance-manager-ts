import CollectionTest from "./CollectionTest";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Cart from "./routes/cart";
import ErrorPage from "./routes/errorPage";
import Home from "./routes/home";
import { Toaster } from "sonner";
export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root/>,
      errorElement: <ErrorPage/>,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/test",
          element: <CollectionTest/>
        },
        {
          path: "/cart",
          element: <Cart/>
        }
      ]
    }
  ]);
  
  return (
    <div className="">
      <RouterProvider router={router} />
      <Toaster/>
    </div>
  )
}