import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Modal } from "antd";
import { jwtDecode } from "jwt-decode";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginModal, setLoginModal] = useState({
    visible: false,
    title: "",
    content: "",
    type: "success" as "success" | "error" | "info"
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const userId = query.get('userId');
    
    // Check if we're returning from Google OAuth flow
    if (!token && !userId) {
      // Retrieve the OAuth state from localStorage
      const oauthState = localStorage.getItem('oauth_state');
      
      if (oauthState) {
        verifyOAuthToken(oauthState);
      }
    } else if (token && userId) {
      // Existing token handling logic
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
  
      try {
        const userData: any = jwtDecode(token);
        const userRole = userData.role;
        localStorage.setItem("role", userRole);

        // Show success modal for Google login
        showLoginNotification("Login Successful", "You have successfully logged in with Google!", "success");
  
        setTimeout(() => {
          setLoginModal(prev => ({ ...prev, visible: false }));
          if (userRole === "Admin") {
            navigate("/my-admin");
          } else if (userRole === "Doctor") {
            navigate("/my-doctor");
          } else {
            navigate("/home"); 
          }
        }, 1500);
      } catch (error) {
        let errorMessage = "Error processing login information.";
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            errorMessage = error.response.data.message || errorMessage;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
     
        showLoginNotification("Login Failed", errorMessage, "error");
      }
    }
  }, [location, navigate]);
  
  const showLoginNotification = (title: string, content: string, type: "success" | "error" | "info") => {
    setLoginModal({
      visible: true,
      title,
      content,
      type
    });
  };

  // New function to verify OAuth token
  const verifyOAuthToken = async (oauthState: string) => {
    setLoading(true);
    
    try {
      // Call the verification API with the OAuth state
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/auth/verify-token`, {
        params: { token: oauthState }
      });
      
      if (response.status === 200) {
        // Assuming the API returns the same structure as your login endpoint
        const { accessToken, userId } = response.data.data || response.data;
        
        // Store token and user ID
        localStorage.setItem("token", accessToken);
        localStorage.setItem("userId", userId);
        
        // Clear the OAuth state as it's no longer needed
        localStorage.removeItem('oauth_state');
        
        // Decode the token to get user role
        const userData: any = jwtDecode(accessToken);
        const userRole = userData.role;
        localStorage.setItem("role", userRole);
        
        showLoginNotification("Google Authentication Verified", "Your Google authentication was verified successfully!", "success");
        
        // Redirect based on user role
        setTimeout(() => {
          setLoginModal(prev => ({ ...prev, visible: false }));
          if (userRole === "Admin") {
            navigate("/my-admin/users");
          } else if (userRole === "Doctor") {
            navigate("/my-doctor/consultation-response");
          } else {
            navigate("/home");
          }
        }, 1500);
      }
    } catch (error: any) {
      console.error("OAuth verification failed:", error);
      showLoginNotification("Authentication Failed", error.response?.data?.message || "OAuth verification failed. Please try again.", "error");
      // Clear the invalid OAuth state
      localStorage.removeItem('oauth_state');
    } finally {
      setLoading(false);
    }
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

        // Show success modal
        showLoginNotification("Login Successful", `Welcome back! You've successfully logged in.`, "success");

        setTimeout(() => {
          setLoginModal(prev => ({ ...prev, visible: false }));
          if (userRole === "Admin") {
            navigate("/my-admin/users");
          } else if (userRole === "Doctor") {
            navigate("/my-doctor/consultation-response");
          } else {
            navigate("/home");
          }
        }, 1500);
      }
    } catch (error: any) {
      showLoginNotification("Login Failed", error.response?.data?.message || "Login failed. Please check your credentials and try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = () => {
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem('oauth_state', state);
    
    const redirectUri = `${window.location.origin}/login`;
    const googleLoginUrl = `${import.meta.env.VITE_API_ENDPOINT}/auth/google/login?redirect=${encodeURIComponent(redirectUri)}&state=${state}`;
    
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

      {/* Login Notification Modal */}
      <Modal
        open={loginModal.visible}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {loginModal.type === 'success' && <i className="ri-checkbox-circle-fill" style={{ color: '#52c41a', fontSize: '20px' }} />}
            {loginModal.type === 'error' && <i className="ri-close-circle-fill" style={{ color: '#f5222d', fontSize: '20px' }} />}
            {loginModal.type === 'info' && <i className="ri-information-fill" style={{ color: '#1890ff', fontSize: '20px' }} />}
            <span>{loginModal.title}</span>
          </div>
        }
        footer={null}
        closable={true}
        onCancel={() => setLoginModal(prev => ({ ...prev, visible: false }))}
        centered
        maskClosable
      >
        <p>{loginModal.content}</p>
      </Modal>
    </div>
  );
};

export default LoginPage;