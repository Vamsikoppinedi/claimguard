import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Terms from "./Terms";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ClerkProvider publishableKey="pk_test_aHVtYW5lLWNyYXlmaXNoLTQ3LmNsZXJrLmFjY291bnRzLmRldiQ">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  </ClerkProvider>
);