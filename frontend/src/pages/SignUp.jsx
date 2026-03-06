import React from "react";
import logo from "../assets/logo.jpg";
function SignUp() {
  return (
    <div className="bg-[#dddbdb] w-screen h-screen flex items-center justify-center">
      <form className="w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex">
        {/* left div */}
        <div className="md:w-[50%] w-full h-full flex flex-col items-center justify-center gap-3">
          <div>
            <h1 className="font-semibold text-[black] text-2xl">
              let's get started
            </h1>
            <h2 className="text-[#999797] text-[18px]">Create your account</h2>
          </div>
        </div>

        {/* right div */}

        <div className="w-[50%] h-full rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden">
          <img src={logo} alt="logo" className="w-30 shadow-2xl" />
          <span className="text-2xl text-white">Start Learning</span>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
