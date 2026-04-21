import React, { useEffect, useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./AppRoutes";
import { useDispatch } from "react-redux";
import { setUser } from "../feature/auth/state/auth.slice";
import { getMe } from "../feature/auth/service/auth.api";

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // On every page load/refresh: hit /api/auth/me with the httpOnly cookie.
    // If valid, re-hydrate Redux; if not, clear any stale localStorage data.
    getMe()
      .then((data) => {
        dispatch(setUser(data.user));
      })
      .catch(() => {
        // Token missing or expired — clear stale user from Redux/localStorage
        dispatch(setUser(null));
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, [dispatch]);

  // Don't render routes until auth state is resolved to avoid flashes
  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF9F7",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "2px solid #1A1C19",
            borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
