import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import {
  ClerkProvider
} from "@clerk/clerk-react";

const PUBLISHABLE_KEY =
  "pk_test_aHVtYW5lLWNyYXlmaXNoLTQ3LmNsZXJrLmFjY291bnRzLmRldiQ";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);