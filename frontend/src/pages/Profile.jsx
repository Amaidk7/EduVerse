import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEnvelope, FaUserGraduate, FaBookOpen } from "react-icons/fa6";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const avatarChar = userData?.name?.slice(0, 1).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="animate-scale-in" style={{ width: "100%", maxWidth: 480, background: "var(--bg-card)", borderRadius: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-hover)", overflow: "hidden" }}>

        {/* Header Banner */}
        <div style={{ height: 100, background: "var(--text-primary)", position: "relative" }}>
          <button onClick={() => navigate("/")} style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <FaArrowLeftLong /> Back
          </button>
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -48, paddingBottom: 32, padding: "0 32px 32px" }}>
          <div style={{ marginTop: -48, marginBottom: 16 }}>
            {userData?.photoUrl ? (
              <img src={userData.photoUrl} style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "4px solid var(--bg-card)", boxShadow: "var(--shadow-hover)" }} alt="" />
            ) : (
              <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, border: "4px solid var(--bg-card)", boxShadow: "var(--shadow-hover)", fontFamily: "Syne, sans-serif" }}>
                {avatarChar}
              </div>
            )}
          </div>

          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{userData?.name}</h2>
          <span className="badge" style={{ textTransform: "capitalize" }}>{userData?.role}</span>

          {/* Info Cards */}
          <div style={{ width: "100%", marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: <FaEnvelope size={15} />, label: "Email", value: userData?.email },
              { icon: <FaUserGraduate size={15} />, label: "Bio", value: userData?.description || "No bio added yet" },
              { icon: <FaBookOpen size={15} />, label: "Enrolled Courses", value: userData?.enrolledCourses?.length + " courses" },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ background: "var(--bg-secondary)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 12, border: "1px solid var(--border)" }}>
                <span style={{ color: "var(--accent)", marginTop: 1 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, color: "var(--text-primary)" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24, width: "100%" }}>
            <button className="btn-outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => navigate("/mycourses")}>My Courses</button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => navigate("/editprofile")}>Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
