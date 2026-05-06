import React, { useState } from "react";
import jsPDF from "jspdf";

function App() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  // ✅ API CALL
  const analyze = async () => {
    try {
      const res = await fetch("https://claimguard-nsbr.onrender.com/analyze-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ note })
      });

      const data = await res.json();
      setResult(data);

    } catch (error) {
      console.error("Error:", error);
      alert("Backend not reachable");
    }
  };

  // ✅ PDF DOWNLOAD
  const downloadPDF = () => {
    if (!result) return;
  
    const doc = new jsPDF();
  
    let y = 20;
  
    doc.setFontSize(18);
    doc.text("ClaimGuard AI Report", 20, y);
  
    y += 15;
  
    doc.setFontSize(12);
  
    doc.text(`Risk: ${result.risk}`, 20, y);
    y += 10;
  
    doc.text(
      `Documentation Completeness: ${result.completeness}%`,
      20,
      y
    );
    y += 10;
  
    doc.text(
      `Potential Revenue Loss: ${result.revenueImpact}`,
      20,
      y
    );
    y += 15;
  
    doc.text("Pre-Adjudication Checks:", 20, y);
    y += 10;
  
    doc.text(
      `Patient Eligible: ${result.eligible ? "Yes" : "No"}`,
      25,
      y
    );
    y += 10;
  
    doc.text(
      `Valid Provider: ${result.validProvider ? "Yes" : "No"}`,
      25,
      y
    );
    y += 10;
  
    doc.text(
      `Valid Codes: ${result.validCodes ? "Yes" : "No"}`,
      25,
      y
    );
    y += 15;
  
    doc.text(`Final Decision: ${result.finalDecision}`, 20, y);
    y += 15;
  
    doc.text("Missing Elements:", 20, y);
    y += 10;
  
    if (result.missing.length > 0) {
      result.missing.forEach((item) => {
        doc.text(`- ${item}`, 25, y);
        y += 10;
      });
    } else {
      doc.text("None", 25, y);
      y += 10;
    }
  
    y += 10;
  
    doc.text("Suggestions:", 20, y);
    y += 10;
  
    if (result.suggestions.length > 0) {
      result.suggestions.forEach((item) => {
        doc.text(`- ${item}`, 25, y);
        y += 10;
      });
    } else {
      doc.text("None", 25, y);
    }
  
    doc.save("ClaimGuard_Report.pdf");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>

      <h2>ClaimGuard AI</h2>

      <p style={{ color: "red" }}>
        ⚠ Do not enter real patient data. This tool is for testing only.
      </p>

      <textarea
        style={{ width: "100%", height: "120px", marginBottom: "10px" }}
        placeholder="Enter patient note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br />

      <button onClick={analyze}>Analyze</button>

      {/* ✅ RESULT */}
      {result && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px" }}>

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

          {/* ✅ ALWAYS SHOW MISSING */}
          <div>
            <b>Missing Elements:</b>
            <ul>
              {result.missing.length > 0
                ? result.missing.map((item, i) => <li key={i}>{item}</li>)
                : <li>None</li>}
            </ul>
          </div>

          {/* ✅ ALWAYS SHOW SUGGESTIONS */}
          <div>
            <b>Suggestions:</b>
            <ul>
              {result.suggestions.length > 0
                ? result.suggestions.map((item, i) => <li key={i}>{item}</li>)
                : <li>No suggestions</li>}
            </ul>
          </div>

          {/* ✅ PDF BUTTON */}
          <button onClick={downloadPDF} style={{ marginTop: "10px" }}>
            Download PDF
          </button>

        </div>
      )}

      {/* ✅ FOOTER */}
      <div style={{ marginTop: "30px", fontSize: "12px", color: "gray" }}>
        ⚠ This tool is for educational/demo purposes only. Do not enter real patient data.
        <br />
        <a href="/terms" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>
      </div>

    </div>
  );
}

export default App;