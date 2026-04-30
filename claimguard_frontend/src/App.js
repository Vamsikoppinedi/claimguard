import React, { useState, useEffect } from "react";
import { useUser, SignedOut, SignInButton } from "@clerk/clerk-react";

function App() {
  const { user, isSignedIn } = useUser();

  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(user.id);
      setCount(saved ? parseInt(saved) : 0);
    }
  }, [user]);

  const analyze = async () => {
    if (!note.trim()) return;
    if (count >= 5) return;

    setLoading(true);

    try {
      const response = await fetch("https://claimguard-nsbr.onrender.com/analyze-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ note })
      });

      const data = await response.json();
      setResult(data);

      const newCount = count + 1;
      setCount(newCount);
      localStorage.setItem(user.id, newCount);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  if (!isSignedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>ClaimGuard AI</h1>
        <SignInButton />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>ClaimGuard AI</h1>

      <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
        ⚠️ Do not enter real patient data. This tool is for testing and educational use only.
      </p>

      <p style={{ textAlign: "right", fontSize: "14px" }}>
        {count} / 5 free analyses used
      </p>

      <textarea
        rows="5"
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        placeholder="Enter patient note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        onClick={analyze}
        style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none" }}
      >
        Analyze
      </button>

      {loading && <p>Analyzing...</p>}

      {result && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc" }}>
          <h3>Risk: {result.risk}</h3>
          <p>Documentation Completeness: {result.completeness}%</p>
        </div>
      )}

      {count >= 5 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>Upgrade Required</h3>
          <p>Unlock unlimited analyses for $99/month</p>
          <button style={{ padding: "10px 20px", backgroundColor: "green", color: "white", border: "none" }}>
            Upgrade
          </button>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <a href="/terms">Terms of Service</a>
      </div>
    </div>
  );
}

export default App;