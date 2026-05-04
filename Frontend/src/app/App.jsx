import React, { useEffect, useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./AppRoutes";
import { useDispatch } from "react-redux";
import { setUser } from "../feature/auth/state/auth.slice";
import { getMe } from "../feature/auth/service/auth.api";
import ChatbotWidget from "../components/common/ChatbotWidget";
import ServerWakeup from "../components/common/ServerWakeup";

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  // ServerWakeup is mounted once and runs silently in the background.
  // It renders nothing if server is awake, shows loader only if sleeping.
  const [showWakeup, setShowWakeup] = useState(true);

  useEffect(() => {
    // Auth check runs immediately — not gated by server wakeup.
    // If server is sleeping, this will also fail gracefully (user stays logged out)
    // and the wakeup loader guides them to wait.
    getMe()
      .then((data) => dispatch(setUser(data.user)))
      .catch(() => dispatch(setUser(null)))
      .finally(() => setAuthChecked(true));
  }, [dispatch]);

  // Minimal spinner while auth resolves (only visible if server is awake — very fast)
  if (!authChecked) {
    return (
      <>
        {/* Wakeup loader — renders null if server is awake, shows UI only if sleeping */}
        <ServerWakeup onReady={() => setShowWakeup(false)} />

        {/* Show spinner only once wakeup confirms server is awake */}
        {!showWakeup && (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FAF8F5",
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
        )}
      </>
    );
  }

  return (
    <>
      <RouterProvider router={routes} />
      <ChatbotWidget />
    </>
  );
}

export default App;
