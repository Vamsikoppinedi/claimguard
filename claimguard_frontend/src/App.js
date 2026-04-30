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

    {result.missing.length > 0 && (
      <>
        <p><b>Missing Elements:</b></p>
        <ul>
          {result.missing.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </>
    )}

    {result.suggestions.length > 0 && (
      <>
        <p><b>Suggestions:</b></p>
        <ul>
          {result.suggestions.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </>
    )}
  </div>
)}