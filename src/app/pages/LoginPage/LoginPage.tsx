import React, { useState } from "react";
import Header from "../../components/Layout/Header";
import { FaFacebookF, FaGoogle, FaTwitter, FaUser, FaLock } from "react-icons/fa";

// Import hình nền nếu nằm trong `src/assets/`
import background from "../../../assets/background.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    alert("Login successful!");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1]"
        style={{ backgroundImage: `url(${background})` }} // Nếu ảnh nằm trong `src/assets`
      ></div>

      {/* <Header /> */}

      {/* Overlay tối nhẹ */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Login Box */}
      <div className="relative bg-black/50 p-8 rounded-lg shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        {/* Social Login Icons */}
        <div className="flex justify-center space-x-4 mb-4">
          <button className="bg-yellow-500 text-black p-2 rounded-full">
            <FaFacebookF size={20} />
          </button>
          <button className="bg-yellow-500 text-black p-2 rounded-full">
            <FaGoogle size={20} />
          </button>
          <button className="bg-yellow-500 text-black p-2 rounded-full">
            <FaTwitter size={20} />
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              className="w-full p-2 pl-10 border border-gray-300 rounded bg-black/20 text-white placeholder-gray-300"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              className="w-full p-2 pl-10 border border-gray-300 rounded bg-black/20 text-white placeholder-gray-300"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-4">
            <input type="checkbox" className="mr-2" />
            <label>Remember Me</label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black p-2 rounded hover:bg-yellow-600 transition font-semibold"
          >
            Login
          </button>
        </form>

        {/* Sign Up & Forgot Password */}
        <div className="text-center mt-4 text-sm">
          <p>
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:underline">
              Sign Up
            </a>
          </p>
          <p>
            <a href="/forgot-password" className="text-blue-400 hover:underline">
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
