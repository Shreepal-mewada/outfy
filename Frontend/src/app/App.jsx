import React from "react";
import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./AppRoutes";
function App() {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
