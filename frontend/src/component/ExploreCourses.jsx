import React from "react";
import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { AiFillOpenAI } from "react-icons/ai";
import { SiGoogledataproc } from "react-icons/si";
import { BsClipboardData } from "react-icons/bs";
import { SiOpenaigym } from "react-icons/si";
import { useNavigate } from "react-router-dom";
function ExploreCourses() {
  const navigate = useNavigate();
  return (
    <div className="w-screen min-h-[50vh] lg:h-[50vh] flex flex-col lg:flex-row items-center justify-center gap-4 px-7.5">
      {/* left/top div */}
      <div className="w-full lg:w-87.5 lg:h-full h-100  flex flex-col items-start justify-center gap-1 md:px-10  px-5">
        <span className="text-[35px] font-semibold">Explore</span>
        <span className="text-[35px] font-semibold">Our Courses</span>
        <p className="text-[17px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem vel iure
          explicabo laboriosam accusantium expedita laudantium facere magnam.
        </p>
        <button
          className="px-5 py-2.5 border-2 bg-[black] border-white text-white rounded-[10px] text-[18px] font-light flex gap-2 mt-10 cursor-pointer"
          onClick={() => navigate("/allcourses")}
        >
          Explore Courses{" "}
          <SiViaplay className="w-7.5 h-7.5 fill-white " />
        </button>
      </div>

      {/* right/bottom div */}
      <div className="w-180 max-w-[90%] lg:h-75 md:min-h-75 flex items-center justify-center lg:gap-15 gap-12.5 flex-wrap mb-12.5 lg:mb-0">
        <div className="w-25 h-32.5 font-light text-[13px] flex flex-col gap-3 text-center">
          <div className="w-25 h-22.5 bg-[#fbd9fb] rounded-lg flex items-center justify-center ">
            <TbDeviceDesktopAnalytics className="w-15 h-15 text-[#6d6c6c]" />
          </div>
          Web Dev
        </div>

        <div className="w-25 h-32.5 font-light text-[13px] flex flex-col gap-3 text-center">
          <div className="w-25 h-22.5 bg-[#d9fbe0] rounded-lg flex items-center justify-center ">
            <LiaUikit className="w-15 h-15 text-[#6d6c6c]" />
          </div>
          UI/UX Designing
        </div>

        <div className="w-25 h-32.5 font-light text-[13px] flex flex-col gap-3 text-center">
          <div className="w-25 h-22.5 bg-[#fcb9c8] rounded-lg flex items-center justify-center ">
            <MdAppShortcut className="w-12.5 h-12.5 text-[#6d6c6c]" />
          </div>
          App dev
        </div>

        <div className="w-25 h-32.5 font-light text-[13px] flex flex-col gap-3 text-center">
          <div className="w-25 h-22.5 bg-[#fbd9fb] rounded-lg flex items-center justify-center ">
            <FaHackerrank className="w-13.75 h-13.75 text-[#6d6c6c]" />
          </div>
          Ethical Hacking
        </div>

        <div className="w-25 h-32.5 font-light text-[13px] flex flex-col gap-3 text-center">
          <div className="w-25 h-22.5 bg-[#d9fbe0]  rounded-lg flex items-center justify-center ">
            <AiFillOpenAI className="w-15 h-15 text-[#6d6c6c]" />
          </div>
          AI/ML
        </div>

        <div className="w-25 h-32.5 font-light text-[13px] flex flex-col gap-3 text-center">
          <div className="w-25 h-22.5 bg-[#fcb9c8] rounded-lg flex items-center justify-center ">
            <SiGoogledataproc className="w-12.5 h-12.5 text-[#6d6c6c]" />
          </div>
          Data Science
        </div>

        <div className="w-25 h-32.5 font-light text-[13px] flex flex-col gap-3 text-center">
          <div className="w-25 h-22.5 bg-[#fbd9fb] rounded-lg flex items-center justify-center ">
            <BsClipboardData className="w-12.5 h-12.5 text-[#6d6c6c]" />
          </div>
          Data Analytics
        </div>

        <div className="w-25 h-32.5 font-light text-[13px] flex flex-col gap-3 text-center">
          <div className="w-25 h-22.5 bg-[#d9fbe0]   rounded-lg flex items-center justify-center ">
            <SiOpenaigym className="w-12.5 h-12.5 text-[#6d6c6c]" />
          </div>
          AI Tools
        </div>
      </div>
    </div>
  );
}

export default ExploreCourses;
