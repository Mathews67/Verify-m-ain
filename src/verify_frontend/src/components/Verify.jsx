import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { verify_backend } from 'declarations/verify_backend';
import CertificateTemplate from './CertificateTemplate'; // Import CertificateTemplate

const Verify = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null); // State to hold certificate data

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");

    try {
      console.log("Attempting to verify document with code:", code);
      const result = await verify_backend.verifyDocument(code);
      console.log("Verification result:", result);

      if ("ok" in result) {
        // The document was found
        const document = result.ok;
        if ("Certificate" in document) {
          const cert = document.Certificate;
          setMessage(`TRUE COPY OF CERTIFICATE: Student ID: ${cert.student_id}, Name: ${cert.name}, Program: ${cert.program}, Year: ${cert.year_of_completion}`);

          // Set the certificate data to display the preview
          setCertificateData({
            studentId: cert.student_id,
            name: cert.name,
            program: cert.program,
            yearOfCompletion: cert.year_of_completion,
            qrCodeValue: cert.qrCodeValue || '', // Assuming this is part of the certificate data
          });
        } else if ("Transcript" in document) {
          const trans = document.Transcript;
          setMessage(`Transcript found: Student ID: ${trans.student_id}, Name: ${trans.name}, Program: ${trans.program}, Year: ${trans.year_of_completion}, Courses: ${trans.courses.join(", ")}`);

          // Clear the certificate data if transcript is found
          setCertificateData(null);
        } else {
          setMessage("Unknown document type");
          setCertificateData(null);
        }
      } else if ("err" in result) {
        // The document was not found or there was an error
        setMessage(result.err);
        setCertificateData(null);
      } else {
        setMessage("Unexpected response from server");
        setCertificateData(null);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("An error occurred during verification: " + error.message);
      setCertificateData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="addUser">
      <h3>Verify</h3>
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <div className="text-center">
            <label htmlFor="verify">Cert || Trans No:</label>
          </div>
          <input
            type="text"
            className="text-center"
            id="certtrans"
            name="verify"
            autoComplete="off"
            placeholder="Enter your Cert or Trans No:"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-warning" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </form>

      {message && <p className="message">{message}</p>}

      {/* Certificate Preview Section */}
      {certificateData && (
        <div className="certificate-preview">
          <h3>Certificate Preview</h3>
          <CertificateTemplate 
            studentName={certificateData.name}
            studentId={certificateData.studentId}
            courseName={certificateData.program}
            issueDate={certificateData.yearOfCompletion}
            qrCodeValue={certificateData.qrCodeValue} // Pass QR code value if available
          />
        </div>
      )}

      <div className="login">
        <Link to="/" className="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Verify;
