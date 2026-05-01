import React, { useState, useEffect } from "react";

function App() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  // Free usage counter
  const [count, setCount] = useState(() => {
    return Number(localStorage.getItem("usageCount")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("usageCount", count);
  }, [count]);

  // 🔥 ANALYZE FUNCTION (IMPORTANT)
  const analyze = async () => {
    if (!note.trim()) {
      alert("Please enter a note");
      return;
    }

    if (count >= 5) {
      alert("Free limit reached. Upgrade required.");
      return;
    }

    try {
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

      console.log("API RESPONSE:", data); // DEBUG

      setResult(data);
      setCount(count + 1);
    } catch (error) {
      console.error("Error:", error);
      alert("Error calling backend");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>ClaimGuard AI</h1>

      <p style={{ color: "red" }}>
        ⚠ Do not enter real patient data. For testing only.
      </p>

      <p>{count} / 5 free analyses used</p>

      {/* TEXT INPUT */}
      <textarea
        rows="7"
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder="Enter patient note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br />

      {/* ANALYZE BUTTON */}
      <button onClick={analyze}>Analyze</button>

      {/* RESULT SECTION */}
      {result && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <h3>Result</h3>

          <p><b>Risk:</b> {result.risk}</p>

          <p>
            <b>Documentation Completeness:</b>{" "}
            {result.completeness !== undefined ? result.completeness : 0}%
          </p>

          <p><b>Potential Revenue Loss:</b> {result.revenueImpact}</p>

          <div>
            <b>Pre-Adjudication Checks:</b>
            <ul>
              <li>
                Patient Eligible: {result.eligible ? "Yes" : "No"}
              </li>
              <li>
                Valid Provider: {result.validProvider ? "Yes" : "No"}
              </li>
              <li>
                Valid Codes: {result.validCodes ? "Yes" : "No"}
              </li>
            </ul>
          </div>

          <p><b>Final Decision:</b> {result.finalDecision}</p>

          {/* Missing */}
          {result.missing && result.missing.length > 0 && (
            <>
              <p><b>Missing Elements:</b></p>
              <ul>
                {result.missing.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <>
              <p><b>Suggestions:</b></p>
              <ul>
                {result.suggestions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {/* DEBUG */}
          <p style={{ fontSize: "10px", color: "gray" }}>
            DEBUG: {JSON.stringify(result)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;