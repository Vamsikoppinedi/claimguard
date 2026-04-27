import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Terms from "./Terms";
import "./App.css";

function Home() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const response = await fetch(
      "https://claimguard-nsbr.onrender.com/analyze-note",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      }
    );

    const data = await response.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ClaimGuard AI</h1>

      <textarea
        placeholder="Enter patient note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ width: "100%", height: "120px" }}
      />

      <br />
      <br />

      <button onClick={analyze}>Analyze</button>

      <p style={{ fontSize: "12px", color: "gray", marginTop: "10px" }}>
        Do not enter real patient data. This tool is for testing and educational use only.
      </p>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Result</h2>
          <p><b>Risk:</b> {result.risk}</p>
          <p><b>Score:</b> {result.score}</p>
          <p><b>Completeness:</b> {result.completeness}%</p>

          <h3>Missing Elements:</h3>
          <ul>
            {result.missing_elements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3>Suggestions:</h3>
          <ul>
            {result.suggestions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <footer style={{ marginTop: "40px", fontSize: "12px", color: "gray" }}>
        <Link to="/terms">Terms of Service</Link>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;