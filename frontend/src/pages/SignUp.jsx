import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

function SignUp() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        { name, password, email, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
      navigate("/");
      toast.success("Signup Successfully");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        { name: user.displayName, email: user.email, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("Signup Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google signup failed");
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
          minHeight: 580,
        }}
      >
        {/* Right Panel — hidden on mobile */}
        <div
          className="hidden md:flex"
          style={{
            width: 300,
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
            Join EduVerse
          </span>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            Start your learning journey today. Access 50+ expert-led courses.
          </p>

          {/* Role Visual */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginTop: 12 }}>
            {[
              { r: "student", emoji: "🎓", label: "I want to learn" },
              { r: "educator", emoji: "🏫", label: "I want to teach" },
            ].map(({ r, emoji, label }) => (
              <div
                key={r}
                onClick={() => setRole(r)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: `1px solid ${role === r ? "rgba(108,99,255,0.8)" : "rgba(255,255,255,0.1)"}`,
                  background: role === r ? "rgba(108,99,255,0.2)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 20 }}>{emoji}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", textTransform: "capitalize" }}>
                    {r}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div
          style={{
            flex: 1,
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
          }}
        >
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
              Create account
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              Join thousands of learners worldwide
            </p>
          </div>

          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Full Name</label>
            <input className="ev-input" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Email</label>
            <input className="ev-input" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="ev-input"
                type={show ? "text" : "password"}
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 42 }}
              />
              <button
                onClick={() => setShow((p) => !p)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                {show ? <IoEye size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          {/* Role Toggle — mobile only */}
          <div className="flex md:hidden gap-3">
            {["student", "educator"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 10,
                  border: `1px solid ${role === r ? "var(--accent)" : "var(--border)"}`,
                  background: role === r ? "var(--accent)" : "var(--bg-secondary)",
                  color: role === r ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Signup Button */}
          <button
            className="btn-primary"
            style={{ justifyContent: "center", height: 46, fontSize: 15 }}
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <ClipLoader size={22} color="var(--bg-primary)" /> : "Create Account"}
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
            onClick={googleSignUp}
          >
            <img src={google} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
            Continue with Google
          </button>

          <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
