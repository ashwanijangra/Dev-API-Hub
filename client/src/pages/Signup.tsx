import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "../styles/auth.css";
import { registerUser } from "../services/authService";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const response = await registerUser({
        name,
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      toast.success("Registration Successful!");

      navigate("/dashboard");

    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="bg-grid"></div>

        <div className="auth-brand">

          <div className="logo-box">
            D/
          </div>

          <h1>
            Start Building Today.
          </h1>

          <p>
            Create your DevAPI Hub account and manage APIs
            like a professional.
          </p>

          <div className="preview-cards">

            <div className="preview-card">

              <span className="badge get">
                GET
              </span>

              <span>/products</span>

              <span>200 OK</span>

            </div>

            <div className="preview-card">

              <span className="badge post">
                POST
              </span>

              <span>/auth/register</span>

              <span>201 Created</span>

            </div>

          </div>

          <div className="feature-grid">

            <div className="feature-card">
              🚀 API Testing
            </div>

            <div className="feature-card">
              📁 Collections
            </div>

            <div className="feature-card">
              🕒 History
            </div>

            <div className="feature-card">
              🔐 Environments
            </div>

          </div>

        </div>

      </div>

      <div className="auth-right">

        <div className="login-card">

          <div className="mini-logo">
            D/
          </div>

          <h2>
            Create Account
          </h2>

          <p>
            Get started with DevAPI Hub
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Create Account
            </button>

          </form>

          <div className="bottom-link">

            Already have an account?

            <Link to="/">
              Sign In
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;