import { createBrowserRouter, Navigate } from "react-router";
import { useSelector } from "react-redux";
import Register from "../feature/auth/pages/Register";
import Login from "../feature/auth/pages/Login";
import Hero from "../components/Hero";
import MainSellerPage from "../feature/products/pages/MainSellerPage";
import CreateProduct from "../feature/products/pages/CreateProduct";

const ProtectedAuthRoute = ({ children }) => {
  const hasToken = document.cookie.includes("token=");
  if (hasToken) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedSellerRoute = ({ children }) => {
  const user = useSelector((state) => state.auth?.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isSeller && user.role !== "seller") {
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

  {
    path: "/seller",
    element: (
      <ProtectedSellerRoute>
        <MainSellerPage />
      </ProtectedSellerRoute>
    ),
  },
  {
    path: "/seller/create",
    element: (
      <ProtectedSellerRoute>
        <CreateProduct />
      </ProtectedSellerRoute>
    ),
  },
]);
