import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from "@clerk/clerk-react";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import { jsPDF } from "jspdf";

// ✅ YOUR CLERK KEY
const clerkPubKey =
  "pk_test_aHVtYW5lLWNyYXlmaXNoLTQ3LmNsZXJrLmFjY291bnRzLmRldiQ";

// ✅ HOME PAGE
function Home() {
  const { user } = useUser();

  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ ANALYZE
  const analyze = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://claimguard-nsbr.onrender.com/analyze-note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note: note,
          }),
        }
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Backend not reachable");
    } finally {
      setLoading(false);
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

    doc.text(
      `Final Decision: ${result.finalDecision}`,
      20,
      y
    );
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "40px 20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "auto",
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
          <div style={{ marginBottom: "20px" }}>
  <SignedOut>
    <SignInButton />
  </SignedOut>

  <SignedIn>
    <UserButton />
  </SignedIn>
</div>
           
            <h1
              style={{
                margin: 0,
                color: "#1f2937",
              }}
            >
              ClaimGuard AI
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              AI-powered clinical documentation review
            </p>
          </div>

          <UserButton />
        </div>

        {/* WARNING */}
        <div
          style={{
            background: "#fff7ed",
            color: "#c2410c",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          ⚠ Do not enter real patient data. Demo/testing only.
        </div>

        {/* TEXTAREA */}
        <textarea
          rows="10"
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "15px",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
          placeholder="Enter patient clinical note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={analyze}
          disabled={loading}
          style={{
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {/* RESULT */}
        {result && (
          <div
            style={{
              marginTop: "30px",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "24px",
              background: "#fafafa",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#111827",
              }}
            >
              Analysis Result
            </h2>

            {/* TOP GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <div style={{ color: "#6b7280" }}>
                  Risk
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color:
                      result.risk === "HIGH"
                        ? "#dc2626"
                        : result.risk === "MEDIUM"
                        ? "#d97706"
                        : "#16a34a",
                  }}
                >
                  {result.risk}
                </div>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <div style={{ color: "#6b7280" }}>
                  Completeness
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  {result.completeness}%
                </div>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <div style={{ color: "#6b7280" }}>
                  Revenue Impact
                </div>

                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {result.revenueImpact}
                </div>
              </div>
            </div>

            {/* CHECKS */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <h3>Pre-Adjudication Checks</h3>

              <ul>
                <li>
                  Patient Eligible:{" "}
                  {result.eligible ? "✅ Yes" : "❌ No"}
                </li>

                <li>
                  Valid Provider:{" "}
                  {result.validProvider
                    ? "✅ Yes"
                    : "❌ No"}
                </li>

                <li>
                  Valid Codes:{" "}
                  {result.validCodes ? "✅ Yes" : "❌ No"}
                </li>
              </ul>
            </div>

            {/* FINAL DECISION */}
            <div
              style={{
                background: "#eff6ff",
                padding: "18px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <b>Final Decision:</b>{" "}
              {result.finalDecision}
            </div>

            {/* MISSING */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <h3>Missing Elements</h3>

              <ul>
                {result.missing.length > 0 ? (
                  result.missing.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>

            {/* SUGGESTIONS */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <h3>Suggestions</h3>

              <ul>
                {result.suggestions.length > 0 ? (
                  result.suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>

            {/* PDF */}
            <button
              onClick={downloadPDF}
              style={{
                marginTop: "20px",
                background: "#111827",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Download PDF Report
            </button>
          </div>
        )}

        {/* FOOTER */}
        <div
          style={{
            marginTop: "40px",
            fontSize: "13px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          <Link to="/terms">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}

// ✅ TERMS PAGE
function Terms() {
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1>Terms of Service</h1>

      <p>
        This application is intended for educational
        and demonstration purposes only.
      </p>

      <p>
        Users must not upload protected health
        information or real patient records.
      </p>

      <br />

      <Link to="/">← Back to Home</Link>
    </div>
  );
}

// ✅ ROUTES
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
}

// ✅ MAIN APP
function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <SignedOut>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <SignIn />
          </div>
        </SignedOut>

        <SignedIn>
          <AppRoutes />
        </SignedIn>
      </Router>
    </ClerkProvider>
  );
}

export default App;