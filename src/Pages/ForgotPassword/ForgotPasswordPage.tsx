import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './ForgotPasswordPage.css';

const ForgotPasswordPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // For verification code input
  const codeLength = 6;
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>(Array(codeLength).fill(null));

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/auth/forgot-password/request`, {
        email: email
      });
      
      message.success('Verification code has been sent to your email');
      setCurrentStep(1);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || 'Failed to send verification code');
      } else {
        message.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      // Combine the code digits
      const fullCode = verificationCode;
      
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/auth/forgot-password/verify`, {
        email: email, 
        otp: fullCode,
        newPassword: password
      });
      
      message.success('Password has been reset successfully');
      setCurrentStep(2); 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || 'Verification failed');
      } else {
        message.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/auth/forgot-password/request`, {
        email: email
      });
      message.success('Verification code has been resent to your email');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || 'Failed to resend verification code');
      } else {
        message.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle code input change
  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    // Update the verification code
    const newCode = verificationCode.split('');
    newCode[index] = value;
    setVerificationCode(newCode.join(''));
    
    // Auto-focus next input box if this one is filled
    if (value && index < codeLength - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };
  
  // Handle backspace in code input
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle paste for code input
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, codeLength).replace(/[^\d]/g, '');
    if (!pastedData) return;
    
    const newCode = verificationCode.split('');
    pastedData.split('').forEach((char, i) => {
      newCode[i] = char;
    });
    setVerificationCode(newCode.join(''));
    
    // Focus the appropriate field
    const focusIndex = Math.min(pastedData.length, codeLength - 1);
    codeInputRefs.current[focusIndex]?.focus();
  };

  const renderStepIndicator = () => {
    return (
      <div className="forgot-password__steps">
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: currentStep >= 0 ? 'var(--first-color)' : 'var(--container-color)', 
              color: currentStep >= 0 ? 'white' : 'var(--text-color)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto',
              transition: 'all 0.3s'
            }}>
              <MailOutlined />
            </div>
            <div style={{ fontSize: 'var(--small-font-size)', marginTop: '8px' }}>Email</div>
          </div>
          
          <div style={{ alignSelf: 'center', height: '2px', background: 'var(--container-color)', flex: 1, margin: '0 10px' }}></div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: currentStep >= 1 ? 'var(--first-color)' : 'var(--container-color)', 
              color: currentStep >= 1 ? 'white' : 'var(--text-color)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto',
              transition: 'all 0.3s'
            }}>
              <KeyOutlined />
            </div>
            <div style={{ fontSize: 'var(--small-font-size)', marginTop: '8px' }}>Verify & Reset</div>
          </div>
          
          <div style={{ alignSelf: 'center', height: '2px', background: 'var(--container-color)', flex: 1, margin: '0 10px' }}></div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: currentStep >= 2 ? 'var(--first-color)' : 'var(--container-color)', 
              color: currentStep >= 2 ? 'white' : 'var(--text-color)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto',
              transition: 'all 0.3s'
            }}>
              <LockOutlined />
            </div>
            <div style={{ fontSize: 'var(--small-font-size)', marginTop: '8px' }}>Done</div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <form onSubmit={handleRequestCode} className="forgot-password__form">
            <div className="forgot-password__box">
              <input
                type="email"
                id="email"
                required
                placeholder=" "
                className="forgot-password__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off" // Prevents the browser from auto-filling previous emails
              />
              <label htmlFor="email" className="forgot-password__label">Email</label>
              <i className="forgot-password__icon"><MailOutlined /></i>
            </div>
            
            <button 
              type="submit" 
              className="forgot-password__button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
            
            <p className="forgot-password__switch">
              Remembered your password? <button type="button" onClick={() => navigate("/login")}>Login</button>
            </p>
          </form>
        );
      
      case 1:
        return (
          <form onSubmit={handleVerifyAndResetPassword} className="forgot-password__form">
            <div className="forgot-password__verification-message">
              <h3 className="verification-title">
                Enter the code that we've emailed to {email.replace(/(\w{3})[\w.-]+@([\w.]+)/g, "$1**@$2")}
              </h3>
            </div>
            
            {/* New Verification Code Input UI */}
            <div className="verification-code-container" onPaste={handlePaste}>
              {Array(codeLength).fill(0).map((_, index) => (
                <input
                  key={index}
                  ref={el => codeInputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={verificationCode[index] || ''}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="verification-code-input"
                  autoComplete="off"
                />
              ))}
            </div>
            
            <div className="forgot-password__box">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder=" "
                className="forgot-password__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password" // Prevents autofill
              />
              <label htmlFor="password" className="forgot-password__label">New Password</label>
              <button 
                type="button"
                className="password-visibility-toggle"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? 
                  <i className="password-visibility-icon eye-open"></i> : 
                  <i className="password-visibility-icon eye-closed"></i>
                }
              </button>
            </div>
            
            <div className="forgot-password__box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                required
                placeholder=" "
                className="forgot-password__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password" // Prevents autofill
              />
              <label htmlFor="confirmPassword" className="forgot-password__label">Confirm Password</label>
              <button 
                type="button"
                className="password-visibility-toggle"
                onClick={toggleConfirmPasswordVisibility}
                tabIndex={-1}
              >
                {showConfirmPassword ? 
                  <i className="password-visibility-icon eye-open"></i> : 
                  <i className="password-visibility-icon eye-closed"></i>
                }
              </button>
            </div>
            
            <button 
              type="submit" 
              className="forgot-password__button"
              disabled={loading || verificationCode.length !== codeLength}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <div className="forgot-password__resend">
              <button 
                type="button" 
                className="forgot-password__resend-button"
                onClick={resendVerificationCode}
                disabled={loading}
              >
                Resend Code
              </button>
            </div>
          </form>
        );
      
      case 2:
        return (
          <div className="forgot-password__success">
            <div className="forgot-password__success-icon">
              <CheckCircleOutlined />
            </div>
            <h2 className="forgot-password__success-title">Password Reset Successfully!</h2>
            <p className="forgot-password__success-subtitle">You can now log in with your new password.</p>
            <button 
              className="forgot-password__button" 
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="forgot-password" style={{ backgroundColor: "#ffffff" }}>
      <button onClick={() => navigate("/")} className="forgot-password__return-button">{"< Return"}</button>
      
      <div className="forgot-password__access">
        <h1 className="forgot-password__title">Reset Your Password</h1>
        <p className="forgot-password__subtitle">
          {currentStep === 0 && "Enter your email to receive a verification code"}
          {currentStep === 1 && "Enter the verification code and create a new password"}
          {currentStep === 2 && "Your password has been reset successfully"}
        </p>
        
        {renderStepIndicator()}
        
        <div className="forgot-password__card">
          {renderStepContent()}
        </div>
      </div>

      <div className="forgot-password__background">
        <img src="src/assets/img/child1.jpg" alt="Background" className="forgot-password__bg" style={{ display: "block" }} />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
