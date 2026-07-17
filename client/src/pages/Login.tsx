import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/auth.css";

import { loginUser } from "../services/authService";
import toast from "react-hot-toast";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    try {

      const response =
        await loginUser({
          email,
          password,
        });

      localStorage.setItem(
        "token",
        response.token
      );

      navigate("/dashboard");

    } catch (error: any) {

    console.error(error);
     toast.error("Login Failed");

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
            Build APIs Faster.
          </h1>

          <p>
            Professional API testing,
            collections and environment
            management for modern developers.
          </p>

          <div className="preview-cards">

            <div className="preview-card">

              <span className="badge get">
                GET
              </span>

              <span>/posts</span>

              <span>200 OK</span>

            </div>

            <div className="preview-card">

              <span className="badge post">
                POST
              </span>

              <span>/users</span>

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
            Welcome Back
          </h2>

          <p>
            Sign in to continue
          </p>

          <form
            onSubmit={handleSubmit}
          >

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e)=>
                setEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Sign In
            </button>

          </form>

          <div className="bottom-link">

            Don't have an account?

            <Link to="/signup">
              Sign Up
            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;