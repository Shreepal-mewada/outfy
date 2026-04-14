import { createBrowserRouter, Navigate } from "react-router";
import Register from "../feature/auth/pages/Register";
import Login from "../feature/auth/pages/Login";
import Hero from "../components/Hero";

const ProtectedAuthRoute = ({ children }) => {
  const hasToken = document.cookie.includes("token=");
  if (hasToken) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Hero />,
  },
  {
    path: "/register",
    element: (
      <ProtectedAuthRoute>
        <Register />
      </ProtectedAuthRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedAuthRoute>
        <Login />
      </ProtectedAuthRoute>
    ),
  },
]);
