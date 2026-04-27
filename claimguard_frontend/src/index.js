import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ClerkProvider publishableKey="pk_test_aHVtYW5lLWNyYXlmaXNoLTQ3LmNsZXJrLmFjY291bnRzLmRldiQ">
    <App />
  </ClerkProvider>
);