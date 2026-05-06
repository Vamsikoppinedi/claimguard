import React, { useState } from "react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from "@clerk/clerk-react";

import jsPDF from "jspdf";

function App() {
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  // ✅ API CALL
  const analyze = async () => {
    try {
      const res = await fetch(
        "https://claimguard-nsbr.onrender.com/analyze-note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ note })
        }
      );

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Backend not reachable");
    }
  };

  // ✅ PDF DOWNLOAD
  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ClaimGuard AI Report", 20, 20);

    doc.setFontSize(12);

    let y = 40;

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
      `Patient Eligible: ${
        result.eligible ? "Yes" : "No"
      }`,
      25,
      y
    );
    y += 10;

    doc.text(
      `Valid Provider: ${
        result.validProvider ? "Yes" : "No"
      }`,
      25,
      y
    );
    y += 10;

    doc.text(
      `Valid Codes: ${
        result.validCodes ? "Yes" : "No"
      }`,
      25,
      y
    );
    y += 15;

    doc.text(
      `Final Decision: ${result.finalDecision}`,
      20,
      y
    );
    y += 15;

    doc.text("Missing Elements:", 20, y);
    y += 10;

    if (result.missing.length === 0) {
      doc.text("None", 25, y);
      y += 10;
    } else {
      result.missing.forEach((item) => {
        doc.text(`• ${item}`, 25, y);
        y += 10;
      });
    }

    y += 5;

    doc.text("Suggestions:", 20, y);
    y += 10;

    if (result.suggestions.length === 0) {
      doc.text("None", 25, y);
    } else {
      result.suggestions.forEach((item) => {
        doc.text(`• ${item}`, 25, y);
        y += 10;
      });
    }

    doc.save("ClaimGuard_Report.pdf");
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      {/* ✅ AUTH */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px"
        }}
      >
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* ✅ TITLE */}
      <h1
        style={{
          fontSize: "42px",
          marginBottom: "20px"
        }}
      >
        ClaimGuard AI
      </h1>

      {/* ✅ WARNING */}
      <p
        style={{
          color: "red",
          fontSize: "20px",
          marginBottom: "20px"
        }}
      >
        ⚠ Do not enter real patient data. This tool is
        for testing only.
      </p>

      {/* ✅ INPUT */}
      <textarea
        rows="10"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter patient note..."
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "20px",
          borderRadius: "10px"
        }}
      />

      <br />
      <br />

      {/* ✅ BUTTON */}
      <button
        onClick={analyze}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Analyze
      </button>

      {/* ✅ RESULT */}
      {result && (
        <div
          style={{
            marginTop: "40px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "30px",
            backgroundColor: "#fafafa"
          }}
        >
          <h2>Result</h2>

          <p>
            <b>Risk:</b> {result.risk}
          </p>

          <p>
            <b>Documentation Completeness:</b>{" "}
            {result.completeness}%
          </p>

          <p>
            <b>Potential Revenue Loss:</b>{" "}
            {result.revenueImpact}
          </p>

          <div>
            <b>Pre-Adjudication Checks:</b>

            <ul>
              <li>
                Patient Eligible:{" "}
                {result.eligible ? "Yes" : "No"}
              </li>

              <li>
                Valid Provider:{" "}
                {result.validProvider ? "Yes" : "No"}
              </li>

              <li>
                Valid Codes:{" "}
                {result.validCodes ? "Yes" : "No"}
              </li>
            </ul>
          </div>

          <p>
            <b>Final Decision:</b>{" "}
            {result.finalDecision}
          </p>

          {/* ✅ Missing */}
          <div>
            <b>Missing Elements:</b>

            <ul>
              {result.missing.length === 0 ? (
                <li>None</li>
              ) : (
                result.missing.map((item, i) => (
                  <li key={i}>{item}</li>
                ))
              )}
            </ul>
          </div>

          {/* ✅ Suggestions */}
          <div>
            <b>Suggestions:</b>

            <ul>
              {result.suggestions.length === 0 ? (
                <li>None</li>
              ) : (
                result.suggestions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))
              )}
            </ul>
          </div>

          {/* ✅ PDF */}
          <button
            onClick={downloadPDF}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              cursor: "pointer"
            }}
          >
            Download PDF
          </button>
        </div>
      )}

      {/* ✅ FOOTER */}
      <div
        style={{
          marginTop: "40px",
          color: "gray",
          fontSize: "14px"
        }}
      >
        ⚠ This tool is for educational/demo purposes
        only. Do not enter real patient data.
        <br />
        <a
          href="/terms"
          target="_blank"
          rel="noreferrer"
        >
          Terms of Service
        </a>
      </div>
    </div>
  );
}

export default App;