import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import "./index.css"; // Import custom dark mode styles

function App() {
  const [file, setFile] = useState(null);
  const [jsonOutput, setJsonOutput] = useState(null);
  const [error, setError] = useState("");
  const [validationResults, setValidationResults] = useState(null);
  const [selectedValidations, setSelectedValidations] = useState({
    CtrlSumCheck: false,
  });
  const [showJson, setShowJson] = useState(false); // Toggle state

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleValidationChange = (event) => {
    const { name, checked } = event.target;
    setSelectedValidations((prev) => ({ ...prev, [name]: checked }));
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://10.7.105.213:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setJsonOutput(response.data.json);
      setError("");
    } catch (error) {
      setError("Error uploading file");
    }
  };

  const handleValidation = async () => {
    if (!jsonOutput) {
      setError("Upload an XML file first");
      return;
    }

    try {
      const response = await axios.post("http://10.7.105.213:5000/validate", {
        jsonData: jsonOutput,
        validations: Object.keys(selectedValidations).filter((key) => selectedValidations[key]),
      });

      setValidationResults(response.data);
      setError("");
    } catch (error) {
      setError("Error running validations");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg rounded">
        <h2 className="text-center text-primary mb-3">🌙 XML Validator (Dark Mode)</h2>

        {/* File Upload Section */}
        <div className="mb-3">
          <input type="file" accept=".xml" className="form-control" onChange={handleFileChange} />
          <button className="btn btn-primary mt-2 w-100" onClick={handleUpload}>
            🚀 Upload & Process
          </button>
        </div>

        {/* Validation Section */}
        <div className="mb-3">
          <h4>Select Validations</h4>
          <div className="form-check">
            <input
              type="checkbox"
              name="CtrlSumCheck"
              className="form-check-input"
              checked={selectedValidations.CtrlSumCheck}
              onChange={handleValidationChange}
            />
            <label className="form-check-label">🔍 CtrlSum Validation</label>
          </div>
          <button className="btn btn-success mt-2 w-100" onClick={handleValidation}>
            ✅ Run Validations
          </button>
        </div>

        {/* Display Validation Results */}
        {validationResults && (
          <div className="alert alert-info mt-3">
            <h4>✅ Validation Results:</h4>
            <pre>{JSON.stringify(validationResults, null, 4)}</pre>
          </div>
        )}

        {/* Toggle Button for JSON Output */}
        {jsonOutput && (
          <div className="mt-3">
            <button
              className={`btn ${showJson ? "btn-danger" : "btn-secondary"} w-100`}
              onClick={() => setShowJson(!showJson)}
            >
              {showJson ? "🙈 Hide JSON Output" : "👀 Show JSON Output"}
            </button>
            {showJson && (
              <div className="alert alert-light border mt-3">
                <h4>📜 Processed JSON:</h4>
                <pre>{JSON.stringify(jsonOutput, null, 4)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Display Error Messages */}
        {error && <div className="alert alert-danger mt-3">❌ {error}</div>}
      </div>
    </div>
  );
}

export default App;
