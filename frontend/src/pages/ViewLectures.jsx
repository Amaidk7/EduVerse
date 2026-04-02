import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { FaArrowLeftLong, FaCirclePlay } from "react-icons/fa6"; // ✅ FIX

function ViewLectures() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const selectedCourse = courseData?.find((c) => c._id === courseId);

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null); // ✅ FIX

  const navigate = useNavigate();

  // ✅ FIX: selectedLecture properly set when course loads
  useEffect(() => {
    if (selectedCourse?.lectures?.length > 0) {
      setSelectedLecture(selectedCourse.lectures[0]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    const handleCreator = async () => {
      if (selectedCourse?.creator) {
        try {
          const result = await axios.post(
            serverUrl + "/api/course/creator",
            { userId: selectedCourse.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
        } catch (e) {
          console.log(e);
        }
      }
    };
    handleCreator();
  }, [selectedCourse]);

  const avatarChar = creatorData?.name?.slice(0, 1)?.toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* ── Top Navbar ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "var(--nav-bg)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--border)",
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 16,
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          <FaArrowLeftLong />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            {selectedCourse?.title}
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
            {selectedCourse?.category} · {selectedCourse?.level}
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          paddingTop: 64,
          minHeight: "100vh",
        }}
        className="lecture-body"
      >
        {/* ── Main Video Area ── */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            minWidth: 0,
            overflowX: "hidden",
          }}
        >
          {/* Video Player */}
          <div
            style={{
              background: "#000",
              borderRadius: 16,
              overflow: "hidden",
              aspectRatio: "16/9",
              marginBottom: 20,
              border: "1px solid var(--border)",
            }}
          >
            {selectedLecture?.videoUrl ? (
              <video
                key={selectedLecture._id}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                src={selectedLecture.videoUrl}
                controls
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <FaCirclePlay size={48} /> {/* ✅ FIX */}
                <span style={{ fontSize: 15 }}>
                  Select a lecture to start watching
                </span>
              </div>
            )}
          </div>

          {/* Lecture Info */}
          {selectedLecture && (
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "20px 24px",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                  marginTop: 0,
                }}
              >
                {selectedLecture?.lectureTitle}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
                Lecture{" "}
                {(selectedCourse?.lectures?.findIndex(
                  (l) => l._id === selectedLecture._id
                ) || 0) + 1}{" "}
                of {selectedCourse?.lectures?.length}
              </p>
            </div>
          )}

          {/* Educator Card */}
          {creatorData && (
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {creatorData.photoUrl ? (
                <img
                  src={creatorData.photoUrl}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt=""
                />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {avatarChar}
                </div>
              )}

              <div>
                <div style={{ fontSize: 11 }}>Educator</div>
                <h4 style={{ margin: 0 }}>{creatorData.name}</h4>
                <p style={{ margin: 0 }}>{creatorData.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div
          className="lecture-sidebar"
          style={{
            width: 300,
            flexShrink: 0,
            borderLeft: "1px solid var(--border)",
            background: "var(--bg-card)",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px)",
            overflowY: "auto", // ✅ FIX
          }}
        >
          <div style={{ fontSize: 11 }}>
            Course Content · {selectedCourse?.lectures?.length || 0} lectures
          </div>

          {selectedCourse?.lectures?.map((lecture, index) => (
            <button
              key={lecture._id}
              onClick={() => setSelectedLecture(lecture)}
              style={{
                display: "flex",
                gap: 10,
                padding: 10,
                borderRadius: 10,
                width: "100%",
                background:
                  selectedLecture?._id === lecture._id ? "#eee" : "transparent",
              }}
            >
              {selectedLecture?._id === lecture._id ? (
                <FaCirclePlay /> // ✅ FIX
              ) : (
                <span>{index + 1}</span>
              )}
              {lecture.lectureTitle}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .lecture-body {
            flex-direction: column !important;
          }
          .lecture-sidebar {
            width: 100% !important;
            height: auto !important;
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ViewLectures;