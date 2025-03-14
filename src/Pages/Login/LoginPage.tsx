import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { message, Spin } from "antd";
import { jwtDecode } from "jwt-decode";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Google OAuth callback
  useEffect(() => {
    // Check if this is a callback from Google OAuth
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const userId = query.get('userId');
    
    if (token && userId) {
      // Store token and user ID
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      try {
        const userData: any = jwtDecode(token);
        const userRole = userData.role;
        localStorage.setItem("role", userRole);

        message.success("Google login successful!");

        // Redirect based on role
        setTimeout(() => {
          if (userRole === "Admin") {
            navigate("/my-admin");
          } else if (userRole === "Doctor") {
            navigate("/my-doctor");
          } else {
            navigate("/home");
          }
        }, 1500);
      } catch (error) {
        message.error("Error processing login information.");
      }
    }
  }, [location, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { accessToken, userId } = response.data.data;
        
        // Store token and user ID
        localStorage.setItem("token", accessToken);
        localStorage.setItem("userId", userId);

        const userData: any = jwtDecode(accessToken);
        const userRole = userData.role;
        localStorage.setItem("role", userRole);

        message.success("Login successful!");

        setTimeout(() => {
          if (userRole === "Admin") {
            navigate("/my-admin/users");
          } else if (userRole === "Doctor") {
            navigate("/my-doctor");
          } else {
            navigate("/home");
          }
        }, 1500);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem('oauth_state', state);
    
    // Get the redirect URL from your environment variables or use a default
    const redirectUri = `${window.location.origin}/login`; // Assuming your login page will handle the callback
    
    // Construct the Google login URL
    const googleLoginUrl = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/auth/google/login?redirect=${encodeURIComponent(redirectUri)}&state=${state}`;
    
    // Redirect to Google login
    window.location.href = googleLoginUrl;
  };

  return (
    <div className="login" style={{ backgroundColor: "#ffffff" }}>
      <button onClick={() => navigate("/")} className="login__return-button">{"< Return"}</button>
      <div className="login__access">
        <h1 className="login__title">Log in to your account.</h1>
        <div className="login__area">
          {loading ? (
            <Spin />
          ) : (
            <form className="login__form" onSubmit={handleLogin} autoComplete="off">
              <div className="login__content grid">
                <div className="login__box">
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder=" "
                    className="login__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-email"
                  />
                  <label htmlFor="email" className="login__label">Email</label>
                  <i className="ri-mail-fill login__icon"></i>
                </div>

                <div className="login__box">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    placeholder=" "
                    className="login__input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <label htmlFor="password" className="login__label">Password</label>
                  <i 
                    className={showPassword ? "ri-eye-fill login__icon login__password" : "ri-eye-off-fill login__icon login__password"} 
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  ></i>
                </div>
              </div>

              <a href="/forgot-password" className="login__forgot">Forgot your password?</a>
              <button type="submit" className="login__button">Login</button>
            </form>
          )}

          <div className="login__social">
            <p className="login__social-title">Or login with</p>
            <div className="login__social-links">
              <a onClick={handleGoogleLogin} className="login__social-link" style={{ cursor: "pointer" }}>
                <img src="src/assets/img/icon-google.svg" alt="Google" className="login__social-img" />
              </a>
              <a href="" className="login__social-link">
                <img src="src/assets/img/icon-facebook.svg" alt="Facebook" className="login__social-img" />
              </a>
              <a href="" className="login__social-link">
                <img src="src/assets/img/icon-apple.svg" alt="Apple" className="login__social-img" />
              </a>
            </div>
          </div>

          <p className="login__switch">
            Don't have an account? <button id="loginButtonRegister" onClick={() => navigate("/register")}>Create Account</button>
          </p>
        </div>
      </div>

      <div className="login__background">
        <img src="src/assets/img/child1.jpg" alt="Background" className="login__bg" style={{ display: "block" }} />
      </div>
    </div>
  );
};

export default LoginPage;