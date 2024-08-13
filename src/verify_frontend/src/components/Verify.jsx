import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { verify_backend } from 'declarations/verify_backend';

const Verify = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
          setMessage(`Certificate found: Student ID: ${cert.student_id}, Name: ${cert.name}, Program: ${cert.program}, Year: ${cert.year_of_completion}`);
        } else if ("Transcript" in document) {
          const trans = document.Transcript;
          setMessage(`Transcript found: Student ID: ${trans.student_id}, Name: ${trans.name}, Program: ${trans.program}, Year: ${trans.year_of_completion}, Courses: ${trans.courses.join(", ")}`);
        } else {
          setMessage("Unknown document type");
        }
      } else if ("err" in result) {
        // The document was not found or there was an error
        setMessage(result.err);
      } else {
        setMessage("Unexpected response from server");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("An error occurred during verification: " + error.message);
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

      <div className="login">
        <Link to="/" className="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Verify;