import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "../src/app/app.store";
import { Provider } from "react-redux";
import App from "../src/app/App";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
);
