import React, { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import { verify_backend } from 'declarations/verify_backend';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");

    try {
      console.log("Attempting to create admin with email:", email);
      const result = await verify_backend .createAdmin(email, password);
      console.log("Create admin result:", result);

      if ("ok" in result) {
        setMessage(result.ok);
      } else if ("err" in result) {
        setMessage(result.err);
      } else {
        setMessage("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      setMessage("An error occurred while creating the account: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="addUser">
      <h3>Sign Up</h3>
      <h3>Verify</h3>

      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="Password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-success" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>
      </form>

      {message && <p className="message">{message}</p>}

      <div className="login">
        <p>Already have an Account?</p>
        <Link to="/" className="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;