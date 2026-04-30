import React, { useState, useEffect } from "react";

function App() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  // ✅ Load count from browser
  const [count, setCount] = useState(() => {
    return Number(localStorage.getItem("usageCount")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("usageCount", count);
  }, [count]);

  // ✅ ANALYZE FUNCTION
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
      setCount(count + 1);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  // ✅ PDF DOWNLOAD
  const downloadPDF = async () => {
    if (!result) return;

    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(14);
    doc.text("ClaimGuard AI Report", 10, y);
    y += 10;

    doc.setFontSize(10);

    doc.text(`Risk: ${result.risk}`, 10, y);
    y += 6;

    doc.text(`Completeness: ${result.score}%`, 10, y);
    y += 6;

    if (result.revenue_impact) {
      doc.text(`Revenue Impact: ${result.revenue_impact}`, 10, y);
      y += 6;
    }

    if (result.decision) {
      doc.text(`Decision: ${result.decision}`, 10, y);
      y += 6;
    }

    if (result.pre_checks) {
      y += 4;
      doc.text("Pre-Adjudication Checks:", 10, y);
      y += 6;

      Object.entries(result.pre_checks).forEach(([key, value]) => {
        doc.text(`${key}: ${value ? "Yes" : "No"}`, 10, y);
        y += 5;
      });
    }

    if (result.missing_elements) {
      y += 4;
      doc.text("Missing Elements:", 10, y);
      y += 6;

      result.missing_elements.forEach((item) => {
        doc.text(`- ${item}`, 10, y);
        y += 5;
      });
    }

    if (result.suggestions) {
      y += 4;
      doc.text("Suggestions:", 10, y);
      y += 6;

      result.suggestions.forEach((item) => {
        doc.text(`- ${item}`, 10, y);
        y += 5;
      });
    }

    doc.save("ClaimGuard_Report.pdf");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>ClaimGuard AI</h2>

      <p style={{ color: "red" }}>
        ⚠ Do not enter real patient data. This tool is for testing only.
      </p>

      <p>{count} / 5 free analyses used</p>

      <textarea
        rows="6"
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder="Enter patient note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br />

      <button onClick={analyze}>Analyze</button>

      {/* ✅ RESULT SECTION */}
      {result && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>Result</h3>

          <p><b>Risk:</b> {result.risk}</p>
          <p><b>Documentation Completeness:</b> {result.score}%</p>

          {result.revenue_impact && (
            <p><b>Potential Revenue Loss:</b> {result.revenue_impact}</p>
          )}

          {result.pre_checks && (
            <div>
              <b>Pre-Adjudication Checks:</b>
              <ul>
                {Object.entries(result.pre_checks).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value ? "Yes" : "No"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.decision && (
            <p><b>Final Decision:</b> {result.decision}</p>
          )}

          {result.missing_elements && (
            <div>
              <b>Missing Elements:</b>
              <ul>
                {result.missing_elements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions && (
            <div>
              <b>Suggestions:</b>
              <ul>
                {result.suggestions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={downloadPDF} style={{ marginTop: "10px" }}>
            Download PDF
          </button>
        </div>
      )}

      <br />
      <a href="/terms">Terms of Service</a>
    </div>
  );
}

export default App;