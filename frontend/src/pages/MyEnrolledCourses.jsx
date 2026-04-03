import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6"
import { FaPlayCircle, FaBookOpen, FaGraduationCap } from "react-icons/fa"

function MyEnrolledCourses() {
  const { userData }   = useSelector(state => state.user)
  const { courseData } = useSelector(state => state.course)   // ← full course objects
  const navigate = useNavigate()

  /*
   * ROOT CAUSE FIX:
   * userData.enrolledCourses = array of ObjectId strings  e.g. ["64abc...", "64def..."]
   * These are NOT populated — they have no thumbnail/title/etc.
   *
   * SOLUTION: match each enrolled ID against courseData (already in Redux)
   * to get the full course object with thumbnail, title, category, level.
   */
  const enrolledCourses = useMemo(() => {
    if (!userData?.enrolledCourses?.length || !courseData?.length) return []

    return userData.enrolledCourses
      .map(enrolled => {
        // enrolled can be a string ID or a partial object
        const enrolledId = typeof enrolled === 'string'
          ? enrolled
          : enrolled?._id?.toString()

        return courseData.find(c => c._id?.toString() === enrolledId)
      })
      .filter(Boolean) // remove any unmatched
  }, [userData?.enrolledCourses, courseData])

  const isEmpty = enrolledCourses.length === 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .ec-root {
          min-height: 100vh;
          background: #0a0a0f;
          padding: 0 0 60px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }

        /* purple glow top-left */
        .ec-root::before {
          content: '';
          position: fixed;
          top: -100px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .ec-header {
          padding: 32px 48px 0;
          position: relative;
          z-index: 1;
        }

        .ec-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          border: none;
          background: none;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
        .ec-back:hover { color: #e5e7eb; }

        .ec-eyebrow {
          font-size: 12px;
          font-weight: 600;
          color: #6366f1;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .ec-title {
          font-family: 'Syne', sans-serif;
          font-size: 42px;
          font-weight: 800;
          color: #f5f5f5;
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .ec-subtitle {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 40px;
        }

        /* ── GRID ── */
        .ec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          padding: 0 48px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 600px) {
          .ec-header { padding: 24px 20px 0; }
          .ec-grid { padding: 0 20px; grid-template-columns: 1fr; }
          .ec-title { font-size: 28px; }
        }

        /* ── COURSE CARD ── */
        .ec-card {
          background: #111118;
          border: 1px solid #1f1f2e;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
          animation: fadeUp 0.4s ease both;
        }
        .ec-card:hover {
          transform: translateY(-4px);
          border-color: #6366f1;
          box-shadow: 0 16px 48px rgba(99,102,241,0.2);
        }

        @keyframes fadeUp {
          from { opacity:0; transform: translateY(16px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* stagger animation per card */
        .ec-card:nth-child(1) { animation-delay: 0.05s; }
        .ec-card:nth-child(2) { animation-delay: 0.10s; }
        .ec-card:nth-child(3) { animation-delay: 0.15s; }
        .ec-card:nth-child(4) { animation-delay: 0.20s; }
        .ec-card:nth-child(5) { animation-delay: 0.25s; }
        .ec-card:nth-child(6) { animation-delay: 0.30s; }

        /* thumbnail */
        .ec-thumb-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #1a1a2e;
          overflow: hidden;
        }

        .ec-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .ec-card:hover .ec-thumb { transform: scale(1.04); }

        /* overlay on hover */
        .ec-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .ec-card:hover .ec-thumb-overlay { opacity: 1; }

        /* thumb placeholder (when no image) */
        .ec-thumb-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          color: #4b5563;
          gap: 8px;
        }

        /* category badge on thumbnail */
        .ec-cat-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(99,102,241,0.85);
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        /* card body */
        .ec-body {
          padding: 16px 18px 18px;
        }

        .ec-course-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #f0f0f0;
          margin-bottom: 6px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ec-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .ec-level {
          font-size: 11px;
          color: #6b7280;
          background: #1f1f2e;
          border: 1px solid #2a2a3e;
          padding: 2px 8px;
          border-radius: 20px;
          text-transform: capitalize;
        }

        /* progress bar */
        .ec-progress-wrap {
          margin-bottom: 14px;
        }
        .ec-progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        .ec-progress-track {
          height: 4px;
          background: #1f1f2e;
          border-radius: 99px;
          overflow: hidden;
        }
        .ec-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          border-radius: 99px;
          width: 0%; /* placeholder — connect to real progress later */
        }

        /* watch button */
        .ec-watch-btn {
          width: 100%;
          padding: 11px;
          background: #6366f1;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.15s;
        }
        .ec-watch-btn:hover { background: #4f46e5; transform: translateY(-1px); }
        .ec-watch-btn:active { transform: translateY(0); }

        /* ── EMPTY STATE ── */
        .ec-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          color: #4b5563;
          text-align: center;
          padding: 40px 20px;
          position: relative;
          z-index: 1;
        }
        .ec-empty svg { opacity: 0.3; margin-bottom: 16px; }
        .ec-empty h3 { font-family:'Syne',sans-serif; font-size:20px; color:#6b7280; margin-bottom:8px; }
        .ec-empty p  { font-size:14px; margin-bottom:24px; }
        .ec-empty-btn {
          background: #6366f1;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size:14px;
          font-weight:600;
          padding: 10px 24px;
          border:none;
          border-radius:12px;
          cursor:pointer;
          transition: background 0.2s;
        }
        .ec-empty-btn:hover { background: #4f46e5; }
      `}</style>

      <div className="ec-root">
        <div className="ec-header">
          <button className="ec-back" onClick={() => navigate("/")}>
            <FaArrowLeftLong size={13} /> Back
          </button>
          <p className="ec-eyebrow">My Learning</p>
          <h1 className="ec-title">Enrolled Courses</h1>
          <p className="ec-subtitle">
            {isEmpty
              ? "Start learning something new today"
              : `${enrolledCourses.length} ${enrolledCourses.length === 1 ? 'course' : 'courses'} in progress`}
          </p>
        </div>

        {isEmpty ? (
          <div className="ec-empty">
            <FaBookOpen size={64} />
            <h3>No courses yet</h3>
            <p>You haven't enrolled in any course yet.<br />Browse and find something you love.</p>
            <button className="ec-empty-btn" onClick={() => navigate("/allcourses")}>
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="ec-grid">
            {enrolledCourses.map((course, i) => (
              <div
                key={course._id || i}
                className="ec-card"
                onClick={() => navigate(`/viewlecture/${course._id}`)}
              >
                {/* Thumbnail */}
                <div className="ec-thumb-wrap">
                  {course.thumbnail ? (
                    <>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="ec-thumb"
                        onError={e => {
                          // if image fails, show placeholder
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      {/* hidden fallback — shown via onError */}
                      <div className="ec-thumb-placeholder" style={{ display: 'none', position: 'absolute', inset: 0 }}>
                        <FaGraduationCap size={40} />
                        <span style={{ fontSize: 12 }}>{course.category}</span>
                      </div>
                    </>
                  ) : (
                    <div className="ec-thumb-placeholder">
                      <FaGraduationCap size={40} />
                      <span style={{ fontSize: 12 }}>{course.category || 'Course'}</span>
                    </div>
                  )}

                  {/* play overlay */}
                  <div className="ec-thumb-overlay">
                    <FaPlayCircle size={52} color="white" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} />
                  </div>

                  {/* category badge */}
                  {course.category && (
                    <span className="ec-cat-badge">{course.category}</span>
                  )}
                </div>

                {/* Card body */}
                <div className="ec-body">
                  <h2 className="ec-course-title">{course.title || 'Untitled Course'}</h2>

                  <div className="ec-meta">
                    {course.level && <span className="ec-level">{course.level}</span>}
                    <span style={{ fontSize: 11, color: '#4b5563' }}>
                      {course.lectures?.length ?? 0} lectures
                    </span>
                  </div>

                  {/* Progress bar (placeholder — hook up to real data later) */}
                  <div className="ec-progress-wrap">
                    <div className="ec-progress-label">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="ec-progress-track">
                      <div className="ec-progress-fill" />
                    </div>
                  </div>

                  <button
                    className="ec-watch-btn"
                    onClick={e => {
                      e.stopPropagation()
                      navigate(`/viewlecture/${course._id}`)
                    }}
                  >
                    <FaPlayCircle size={14} /> Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default MyEnrolledCourses
