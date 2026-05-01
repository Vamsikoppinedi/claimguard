import React, { useState, useEffect } from "react";
import { useUser, SignOutButton, SignInButton } from "@clerk/clerk-react";

function App() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  const { isSignedIn, user } = useUser();

  const [count, setCount] = useState(() => {
    return Number(localStorage.getItem("usageCount")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("usageCount", count);
  }, [count]);

  const analyze = async () => {
    if (!note.trim()) {
      alert("Please enter a note");
      return;
    }

    if (!isSignedIn) {
      alert("Please sign in first");
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

      console.log("API RESPONSE:", data);

      setResult(data);
      setCount(count + 1);
    } catch (error) {
      console.error(error);
      alert("Error calling backend");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>ClaimGuard AI</h1>

      {/* AUTH SECTION */}
      <div style={{ marginBottom: "15px" }}>
        {!isSignedIn ? (
          <SignInButton>
            <button>Sign In</button>
          </SignInButton>
        ) : (
          <>
            <p>Welcome, {user?.firstName}</p>
            <SignOutButton>
              <button style={{ marginBottom: "10px" }}>Sign Out</button>
            </SignOutButton>
          </>
        )}
      </div>

      <p style={{ color: "red" }}>
        ⚠ Do not enter real patient data. For testing only.
      </p>

      <p>{count} / 5 free analyses used</p>

      {/* INPUT */}
      <textarea
        rows="7"
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder="Enter patient note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br />

      <button onClick={analyze}>Analyze</button>

      {/* RESULT */}
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
              <li>Patient Eligible: {result.eligible ? "Yes" : "No"}</li>
              <li>Valid Provider: {result.validProvider ? "Yes" : "No"}</li>
              <li>Valid Codes: {result.validCodes ? "Yes" : "No"}</li>
            </ul>
          </div>

          <p><b>Final Decision:</b> {result.finalDecision}</p>

          {result.missing?.length > 0 && (
            <>
              <p><b>Missing Elements:</b></p>
              <ul>
                {result.missing.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {result.suggestions?.length > 0 && (
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

      {/* TERMS */}
      <div style={{ marginTop: "30px", fontSize: "12px", color: "gray" }}>
        <p>
          ⚠ This tool is for educational/demo purposes only. Do not enter real patient data.
        </p>

        <a href="/terms">Terms of Service</a>
      </div>
    </div>
  );
}

export default App;