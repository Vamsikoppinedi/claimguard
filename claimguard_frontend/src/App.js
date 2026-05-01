import React, { useEffect, useState } from "react";

function App() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

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

    if (count >= 5) {
      alert("Free limit reached. Upgrade required.");
      return;
    }

    try {
      const response = await fetch("https://claimguard-nsbr.onrender.com/analyze-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      });

      const data = await response.json();
      console.log("API RESPONSE:", data);

      setResult(data);
      setCount(count + 1);
    } catch (error) {
      console.error("Analyze error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const downloadPDF = async () => {
    if (!result) return;

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.text("ClaimGuard AI Report", 10, 10);
    doc.text(`Risk: ${result.risk}`, 10, 25);
    doc.text(`Documentation Completeness: ${result.completeness}%`, 10, 35);
    doc.text(`Potential Revenue Loss: ${result.revenueImpact}`, 10, 45);
    doc.text(`Final Decision: ${result.finalDecision}`, 10, 55);

    doc.save("ClaimGuard_Report.pdf");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>ClaimGuard AI</h1>

      <p style={{ color: "red" }}>
        ⚠ Do not enter real patient data. This tool is for testing only.
      </p>

      <p>{count} / 5 free analyses used</p>

      <textarea
        rows="7"
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder="Enter patient note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br />

      <button onClick={analyze}>Analyze</button>

      {result && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>Result</h3>

          <p><b>Risk:</b> {result.risk}</p>
          <p><b>Documentation Completeness:</b> {result.completeness}%</p>
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

          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      )}

      <br />
      <br />

      <a href="/terms">Terms of Service</a>
    </div>
  );
}

export default App;