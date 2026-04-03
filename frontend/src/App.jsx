import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
export const serverUrl = "https://eduverse-bgfe.onrender.com";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getCurrentUser from "./customHooks/getCurrentUser";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Educator/Dashboard";
import Courses from "./pages/Educator/Courses";
import CreateCourses from "./pages/Educator/CreateCourses";
import getCreatorCourse from "./customHooks/getCreatorCourse";
import EditCourse from "./pages/Educator/EditCourse";
import getPublishedCourse from "./customHooks/getPublishedCourse";
import AllCourses from "./pages/AllCourses";
import CreateLecture from "./pages/Educator/CreateLecture";
import EditLecture from "./pages/Educator/EditLecture";
import ViewCourse from "./pages/ViewCourse";
import ScrollToTop from "./component/ScrollToTop";
import ViewLectures from "./pages/ViewLectures";
import MyEnrolledCourses from "./pages/MyEnrolledCourses";
import getAllReviews from "./customHooks/getAllReviews";
import SearchWithAi from "./pages/SearchWithAi";
import { ThemeProvider } from "./context/ThemeContext";
import CursorGradient from "./component/CursorGradient";
// ✅ Student Dashboard import
import StudentDashboard from "./pages/StudentDashboard";

// ✅ NEW IMPORTS ADDED
import RoadmapPage from "./pages/RoadmapPage";
import QuizPage from "./pages/QuizPage";
import NotesPage from "./pages/NotesPage";
import WishlistPage from "./pages/WishlistPage";

function AppRoutes() {
  getCurrentUser();
  getCreatorCourse();
  getPublishedCourse();
  getAllReviews();

  const { userData } = useSelector((state) => state.user);

  return (
    <>
      <CursorGradient />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastStyle={{
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          boxShadow: "var(--shadow-hover)",
          fontSize: 14,
        }}
      />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to={"/signup"} />}
        />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/allcourses"
          element={userData ? <AllCourses /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/dashboard"
          element={
            userData?.role === "educator" ? (
              <Dashboard />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        {/* ✅ Student Dashboard route */}
        <Route
          path="/student-dashboard"
          element={
            userData ? <StudentDashboard /> : <Navigate to={"/signup"} />
          }
        />
        <Route
          path="/courses"
          element={
            userData?.role === "educator" ? (
              <Courses />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/createcourse"
          element={
            userData?.role === "educator" ? (
              <CreateCourses />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/editcourse/:courseId"
          element={
            userData?.role === "educator" ? (
              <EditCourse />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "educator" ? (
              <CreateLecture />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "educator" ? (
              <EditLecture />
            ) : (
              <Navigate to={"/signup"} />
            )
          }
        />
        <Route
          path="/viewcourse/:courseId"
          element={userData ? <ViewCourse /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/viewlecture/:courseId"
          element={userData ? <ViewLectures /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/mycourses"
          element={
            userData ? <MyEnrolledCourses /> : <Navigate to={"/signup"} />
          }
        />
        <Route
          path="/search"
          element={userData ? <SearchWithAi /> : <Navigate to={"/signup"} />}
        />

        {/* ✅ NEW ROUTES ADDED */}
        <Route
          path="/roadmap"
          element={userData ? <RoadmapPage /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/quiz/:courseId"
          element={userData ? <QuizPage /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/notes/:courseId"
          element={userData ? <NotesPage /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/wishlist"
          element={userData ? <WishlistPage /> : <Navigate to={"/signup"} />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;