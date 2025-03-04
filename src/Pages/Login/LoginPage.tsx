import React, { useState } from "react";
import "./LoginPage.css"; // Giữ nguyên CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7217/api/v1/auth/login", {
        email,
        password,
      });
      
      if (response.status === 200) {
        message.success("Login successful!");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || "Login failed. Please try again.");
      } else {
        message.error("Network error. Please check your connection and try again.");
      }
    }
  };

  return (
    <div className="login" style={{ backgroundColor: "#ffffff" }}>
      {/* LOGIN ACCESS */}
      <div className="login__access">
        <h1 className="login__title">Log in to your account.</h1>

        <div className="login__area">
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

          <div className="login__social">
            <p className="login__social-title">Or login with</p>
            <div className="login__social-links">
              <a href="" className="login__social-link">
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

      {/* BACKGROUND IMAGE & EFFECT */}
      <div className="login__background">
        <img src="src/assets/img/bg-img.jpg" alt="Background" className="login__bg" style={{ display: "block" }} />
      </div>
    </div>
  );
};

export default LoginPage;