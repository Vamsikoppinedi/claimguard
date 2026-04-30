import React, { useState, useEffect } from "react";
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

function App() {
  const { user } = useUser();

  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);
  const [count, setCount] = useState(0);

  // ✅ Load usage count safely
  useEffect(() => {
    if (!user) return;

    const saved = localStorage.getItem(user.id);
    if (saved) {
      setCount(parseInt(saved));
    }
  }, [user]);

  // ✅ Analyze API call
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
      setResult(data);

      const newCount = count + 1;
      setCount(newCount);

      if (user) {
        localStorage.setItem(user.id, newCount);
      }
    } catch (err) {
      console.error(err);
      alert("Error calling API");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>
      
      <h1 style={{ textAlign: "center" }}>ClaimGuard AI</h1>

      <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
        ⚠ Do not enter real patient data. This tool is for testing and educational use only.
      </p>

      {/* 🔐 Auth */}
      <SignedOut>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <SignInButton />
        </div>
      </SignedOut>

      <SignedIn>
        <p style={{ textAlign: "right" }}>
          {count} / 5 free analyses used
        </p>

        <textarea
          placeholder="Enter patient note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={6}
          style={{ width: "100%", padding: "10px" }}
        />

        <button
          onClick={analyze}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Analyze
        </button>

        {/* ✅ Result */}
        {result && (
          <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
            <h3>Risk: {result.risk}</h3>
            <p>Documentation Completeness: {result.completeness}%</p>
          </div>
        )}

        {/* 💰 Upgrade */}
        {count >= 5 && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h3>Upgrade Required</h3>
            <p>Unlock unlimited analyses for $99/month</p>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "orange",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Upgrade
            </button>
          </div>
        )}
      </SignedIn>

      {/* 📄 Terms */}
      <p style={{ textAlign: "center", marginTop: "30px" }}>
        <a href="#" target="_blank">Terms of Service</a>
      </p>
    </div>
  );
}

export default App;