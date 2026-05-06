import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import {
  ClerkProvider
} from "@clerk/clerk-react";

const PUBLISHABLE_KEY =
  "YOUR_CLERK_PUBLISHABLE_KEY";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={pk_test_aHVtYW5lLWNyYXlmaXNoLTQ3LmNsZXJrLmFjY291bnRzLmRldiQ}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);