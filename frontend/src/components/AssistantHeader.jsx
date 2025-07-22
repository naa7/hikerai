import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdAssistant } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AssistantHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed z-10 w-full py-4 px-6 bg-[#1F1F1F] font-semibold flex items-center justify-center shadow-md">
      <FaArrowLeft
        className="absolute left-6 text-xl cursor-pointer hover:text-gray-400 transition-colors duration-300"
        onClick={() => navigate("/")}
        style={{ transition: "transform 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
      <div className="flex items-center">
        <MdAssistant alt="HikerAI" className="w-8 h-8" />
        <h1 className="cursor-default text-2xl lg:text-3xl font-bold tracking-wide ml-2 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400 ">
          HikerAI
        </h1>
      </div>
    </header>
  );
};

export default AssistantHeader;
