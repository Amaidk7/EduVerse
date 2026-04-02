import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaPlay } from "react-icons/fa6";
import Nav from "../component/Nav";

function MyEnrolledCourses() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Nav />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 60px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 14, marginBottom: 16 }}>
            <FaArrowLeftLong /> Back
          </button>
          <div className="section-label" style={{ marginBottom: 8 }}>My Learning</div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Enrolled Courses</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            {userData?.enrolledCourses?.length > 0 ? `${userData.enrolledCourses.length} course${userData.enrolledCourses.length > 1 ? "s" : ""} in progress` : "Start your learning journey"}
          </p>
        </div>

        {userData?.enrolledCourses?.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📚</div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>No courses yet</h3>
            <p style={{ fontSize: 15, marginBottom: 24 }}>Explore our catalog and start learning today</p>
            <button className="btn-primary" style={{ justifyContent: "center" }} onClick={() => navigate("/allcourses")}>Browse Courses</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 24 }}>
            {userData?.enrolledCourses?.map((course) => (
              <div key={course._id} className="course-card" style={{ maxWidth: "100%" }}>
                {/* Thumbnail */}
                <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
                  {course?.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="card-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>📚</div>
                  )}
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span className="badge" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", color: "#333", border: "none", fontSize: 11, fontWeight: 600 }}>
                      {course?.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "18px 20px 20px" }}>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {course?.title}
                  </h3>
                  {course?.level && (
                    <span style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14, display: "block" }}>{course.level}</span>
                  )}
                  <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8, gap: 8 }} onClick={() => navigate(`/viewlecture/${course._id}`)}>
                    <FaPlay size={12} /> Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEnrolledCourses;
