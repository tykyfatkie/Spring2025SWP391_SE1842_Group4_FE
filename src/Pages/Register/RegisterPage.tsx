import React, { useState } from "react";
import "./RegisterPage.css"; // Giữ nguyên CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    const apiData = {
      email,
      password,
      name: `${firstName} ${lastName}`,
      phone,
      avatar: '',
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/auth/register`, apiData);

      if (response.status === 200) {
        message.success("Registration successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || "Registration failed. Please try again.");
      } else {
        message.error("Network error. Please check your connection and try again.");
      }
    }
  };

  return (
    <div className="login" style={{ backgroundColor: "#ffffff" }}>
      <div className="login__access">
        <h1 className="login__title">Create your account.</h1>

        <div className="login__area">
          <form className="login__form" onSubmit={handleRegister} autoComplete="off">
            <div className="login__content grid">
              <div className="login__box-container">
                <div className="login__box half-width">
                  <input
                    type="text"
                    id="firstName"
                    required
                    placeholder=" "
                    className="login__input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                  <label htmlFor="firstName" className="login__label">First Name</label>
                  <i className="ri-user-fill login__icon"></i>
                </div>
                <div className="login__box half-width">
                  <input
                    type="text"
                    id="lastName"
                    required
                    placeholder=" "
                    className="login__input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                  <label htmlFor="lastName" className="login__label">Last Name</label>
                  <i className="ri-user-fill login__icon"></i>
                </div>
              </div>
              <div className="login__box">
                <input
                  type="email"
                  id="email"
                  required
                  placeholder=" "
                  className="login__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <label htmlFor="email" className="login__label">Email</label>
                <i className="ri-mail-fill login__icon"></i>
              </div>
              <div className="login__box">
                <input
                  type="tel"
                  id="phone"
                  required
                  placeholder=" "
                  className="login__input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
                <label htmlFor="phone" className="login__label">Phone Number</label>
                <i className="ri-phone-fill login__icon"></i>
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
              <div className="login__box">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  required
                  placeholder=" "
                  className="login__input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <label htmlFor="confirmPassword" className="login__label">Confirm Password</label>
                <i 
                  className={showPassword ? "ri-eye-fill login__icon login__password" : "ri-eye-off-fill login__icon login__password"} 
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            </div>

            <button type="submit" className="login__button">Sign Up</button>
          </form>


          <p className="login__switch">
            Already have an account? <button id="registerButtonLogin" onClick={() => navigate("/login")}>Log In</button>
          </p>
        </div>
      </div>

      <div className="login__background">
        <img src="src/assets/img/child1.jpg" alt="Background" className="login__bg" style={{ display: "block" }} />
      </div>
    </div>
  );
};

export default RegisterPage;