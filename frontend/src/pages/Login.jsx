import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "@firebase/auth";
import { auth, provider } from "../../utils/firebase";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
      toast.success("Login Successfully");
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        { name: user.displayName, email: user.email, role: "" },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("Login Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google Login Failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="animate-scale-in"
        style={{
          width: "100%",
          maxWidth: 880,
          display: "flex",
          background: "var(--bg-card)",
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-hover)",
          minHeight: 540,
        }}
      >
        {/* Left Form */}
        <div
          style={{
            flex: 1,
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {/* Back */}
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontSize: 14,
              marginBottom: 4,
              alignSelf: "flex-start",
            }}
          >
            <FaArrowLeftLong /> Back
          </button>

          <div style={{ marginBottom: 4 }}>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              Login to continue your learning journey
            </p>
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Email
            </label>
            <input
              className="ev-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="ev-input"
                type={show ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{ paddingRight: 42 }}
              />
              <button
                onClick={() => setShow((p) => !p)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                }}
              >
                {show ? <IoEye size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={{ textAlign: "right", marginTop: -10 }}>
            <span
              onClick={() => navigate("/forget")}
              style={{
                fontSize: 13,
                color: "var(--accent)",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button
            className="btn-primary"
            style={{ justifyContent: "center", height: 46, fontSize: 15 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <ClipLoader size={22} color="var(--bg-primary)" /> : "Login"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Google */}
          <button
            className="btn-outline"
            style={{ justifyContent: "center", height: 46 }}
            onClick={googleLogin}
          >
            <img src={google} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
            Continue with Google
          </button>

          <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center" }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* Right Panel — hidden on mobile */}
        <div
          className="hidden md:flex"
          style={{
            width: 320,
            background: "var(--text-primary)",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 40,
            flexShrink: 0,
          }}
        >
          <img
            src={logo}
            alt=""
            style={{ width: 72, height: 72, borderRadius: 16, objectFit: "cover" }}
          />
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 22,
              fontWeight: 800,
              color: "var(--bg-primary)",
              textAlign: "center",
            }}
          >
            EduVerse
          </span>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            Learn from world-class instructors. Build real skills. Advance your career.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            {[["50+", "Courses"], ["1k+", "Students"], ["4.8★", "Rating"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "var(--bg-primary)" }}>
                  {val}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
