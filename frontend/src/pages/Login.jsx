import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "@firebase/auth";
import { auth, provider } from "../../utils/firebase";
import { FaArrowLeftLong } from "react-icons/fa6";

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
        serverUrl + "/api/user/login",
        { email, password },
        { withCredentials: true },
      );

      dispatch(setUserData(result.data));
      setLoading(false);
      toast.success("Login Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);

      const user = response.user;
      const name = user.displayName;
      const googleEmail = user.email;
      const role = "";

      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        { name, email: googleEmail, role },
        { withCredentials: true },
      );

      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Google Login Failed");
    }
  };

  return (
    <div className="bg-[#dddbdb] w-screen h-screen flex items-center justify-center ">
      <form
        className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex relative"
        onSubmit={(e) => e.preventDefault()}
      >
        <FaArrowLeftLong
          className="absolute top-[16%] left-[5%] w-5.5 h-5.5 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="md:w-[50%] w-full h-full flex flex-col items-center justify-center gap-3 ">
          <div>
            <h1 className="font-semibold text-[black] text-2xl">
              Welcome back
            </h1>
            <h2 className="text-[#999797] text-[18px]">Login your account</h2>
          </div>

          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="text"
              className="border w-full h-8.75 border-[#e7e6e6] text-[15px] px-5"
              placeholder="Your Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>

            <input
              id="password"
              type={show ? "text" : "password"}
              className="border w-full h-8.75 border-[#e7e6e6] text-[15px] px-5"
              placeholder="Your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            {!show ? (
              <IoEyeOutline
                className="absolute w-5 h-5 cursor-pointer right-[5%] bottom-[10%]"
                onClick={() => setShow((prev) => !prev)}
              />
            ) : (
              <IoEye
                className="absolute w-5 h-5 cursor-pointer right-[5%] bottom-[10%]"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </div>

          <button
            className="w-[80%] h-10 bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Login"}
          </button>

          <span
            className="text-[13px] cursor-pointer text-[#585757]"
            onClick={() => navigate("/forget")}
          >
            Forget your password ?
          </span>

          <div className="w-[80%] flex items-center gap-2">
            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
            <div className="w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center ">
              Or continue
            </div>
            <div className="w-[25%] h-[0.5px] bg-[#c4c4c4]"></div>
          </div>

          <div
            className="w-[80%] h-10 border border-[black] rounded-[5px] flex items-center justify-center cursor-pointer"
            onClick={googleLogin}
          >
            <img src={google} className="w-6.25" alt="" />
            <span className="text-[18px] text-gray-500">oogle</span>
          </div>

          <div className="text-[#6f6f6f]">
            Create new account
            <span
              className="underline underline-offset-1 text-[black]"
              onClick={() => navigate("/signup")}
            >
              SignUp
            </span>
          </div>
        </div>

        <div className="w-[50%] h-full rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden">
          <img src={logo} alt="logo" className="w-30 shadow-2xl" />
          <span className="text-2xl text-white">VIRTUAL COURSES</span>
        </div>
      </form>
    </div>
  );
}

export default Login;
