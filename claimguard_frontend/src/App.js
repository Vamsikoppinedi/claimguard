import React, { useState } from "react";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  // 🔹 API CALL
  const analyze = async () => {
    const response = await fetch("http://localhost:8080/analyze-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ note })
    });

    const data = await response.json();
    setResult(data);
  };

  // 🔹 PDF DOWNLOAD
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
  
    doc.text(`Provider: ${result.validProvider ? "Yes" : "No"}`, 10, y);
    y += 7;
  
    doc.text(`Codes: ${result.validCodes ? "Yes" : "No"}`, 10, y);
    y += 10;
  
    doc.text(`Final Decision: ${result.finalDecision}`, 10, y);
    y += 10;
  
    doc.text("Missing Elements:", 10, y);
    y += 7;
  
    if (result.missing_elements.length === 0) {
      doc.text("None", 10, y);
      y += 7;
    } else {
      result.missing_elements.forEach((item) => {
        doc.text(`- ${item}`, 10, y);
        y += 7;
      });
    }
  
    y += 5;
  
    doc.text("Suggestions:", 10, y);
    y += 7;
  
    if (result.suggestions.length === 0) {
      doc.text("No suggestions — documentation complete", 10, y);
    } else {
      result.suggestions.forEach((item) => {
        doc.text(`- ${item}`, 10, y);
        y += 7;
      });
    }
  
    doc.save("ClaimGuard_Report.pdf");
  };

  return (
    <div className="container">
      <h1>ClaimGuard AI</h1>

      {/* INPUT */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Paste clinical note here..."
        className="textarea"
      />

      <button onClick={analyze} className="button">
        Analyze
      </button>

      {/* RESULT */}
      {result && (
        <div className="result">
          <h2>Result</h2>

          {/* 🔹 Risk */}
          <h3 className={result.risk === "HIGH" ? "risk-high" : "risk-low"}>
            Risk: {result.risk}
          </h3>

          {/* 🔹 Business Metrics */}
          <p>
            <b>Potential Revenue Loss:</b> {result.revenueImpact}
          </p>

          <p>
            <b>Documentation Completeness:</b> {result.completeness}%
          </p>

          {/* 🔹 Pre-Adjudication */}
          <h4>Pre-Adjudication Checks:</h4>
          <ul>
            <li>Patient Eligible: {result.eligible ? "Yes" : "No"}</li>
            <li>Valid Provider: {result.validProvider ? "Yes" : "No"}</li>
            <li>Valid Codes: {result.validCodes ? "Yes" : "No"}</li>
          </ul>

          {/* 🔹 Adjudication */}
          <h3>
            Final Decision: {result.finalDecision}
          </h3>

          {/* 🔹 Details */}
          <h4>Missing Elements:</h4>
          <ul>
            {result.missing_elements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>Suggestions:</h4>
          <ul>
            {result.suggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <button onClick={downloadPDF} className="button">
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;