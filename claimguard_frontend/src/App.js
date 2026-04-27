import React, { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const response = await fetch("https://claimguard-nsbr.onrender.com/analyze-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ note })
    });

    const data = await response.json();
    setResult(data);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(16);
    doc.text("ClaimGuard AI Report", 10, y);

    y += 10;

    doc.setFontSize(12);
    const noteLines = doc.splitTextToSize(`Patient Note: ${note}`, 180);
    doc.text(noteLines, 10, y);

    y += noteLines.length * 7;

    doc.text(`Risk: ${result.risk}`, 10, y);
    y += 7;

    doc.text(`Revenue Impact: ${result.revenueImpact}`, 10, y);
    y += 7;

    doc.text(`Completeness: ${result.completeness}%`, 10, y);
    y += 10;

    doc.text("Pre-Adjudication Checks:", 10, y);
    y += 7;

    doc.text(`Eligible: ${result.eligible ? "Yes" : "No"}`, 10, y);
    y += 7;

    doc.text(`Valid Provider: ${result.validProvider ? "Yes" : "No"}`, 10, y);
    y += 7;

    doc.text(`Valid Codes: ${result.validCodes ? "Yes" : "No"}`, 10, y);

    doc.save("claim-report.pdf");
  };

  return (
    <div className="App">
      <div style={{ position: "absolute", top: 10, right: 20 }}>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <h1>ClaimGuard AI</h1>

      <p style={{ color: "red", fontSize: "14px" }}>
        Do not enter real patient data. This tool is for testing and educational use only.
      </p>

      <textarea
        placeholder="Enter clinical note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <SignedOut>
        <p>Please sign in to use ClaimGuard AI</p>
      </SignedOut>

      <SignedIn>
        <button onClick={analyze}>Analyze</button>
      </SignedIn>

      {result && (
        <div>
          <h2>Result</h2>
          <p><strong>Risk:</strong> {result.risk}</p>
          <p><strong>Revenue Impact:</strong> {result.revenueImpact}</p>
          <p><strong>Completeness:</strong> {result.completeness}%</p>

          <h3>Pre-Adjudication Checks</h3>
          <ul>
            <li>Eligible: {result.eligible ? "Yes" : "No"}</li>
            <li>Valid Provider: {result.validProvider ? "Yes" : "No"}</li>
            <li>Valid Codes: {result.validCodes ? "Yes" : "No"}</li>
          </ul>

          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      )}

      <footer style={{ marginTop: "40px" }}>
        <a href="https://www.termsfeed.com/live/" target="_blank" rel="noreferrer">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}

export default App;