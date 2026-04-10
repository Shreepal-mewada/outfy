import { createBrowserRouter } from "react-router";
import Register from "../feature/auth/pages/Register";
import Login from "../feature/auth/pages/Login";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <h1 className="bg-red-300">Hello world</h1>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
