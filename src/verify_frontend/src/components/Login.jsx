import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { verify_backend } from 'declarations/verify_backend';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      console.log("Attempting login with email:", email);
      const result = await verify_backend.loginAdmin(email, password);
      console.log("Login result:", result);

      if ("ok" in result) {
        console.log("Login successful");
        alert(result.ok);

        // Store email in localStorage
        localStorage.setItem("userEmail", email);

        navigate("/dashboard");
      } else {
        console.log("Login failed:", result.err);
        alert(result.err);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="addUser">
      <h3>Sign in</h3>
      <h3>Verify</h3>
      <form className="addUserForm" onSubmit={handleLogin}>
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
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <Link to="/Verify" type="button" className="btn btn-warning">
            Verify
          </Link>
          <div className="login">
            <p>Don't have an Account?</p>
            <Link to="/Register" type="button" className="btn btn-success">
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
