import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(username, email, password, confirmPassword);
      setMessage(
        "Registration successful. Check your email for a verification link, then login.",
      );
      setError("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <div className="auth-error">{error}</div>}
      {message && <div className="auth-success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-auth">
          Register
        </button>
      </form>
      <div className="auth-redirect">
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
