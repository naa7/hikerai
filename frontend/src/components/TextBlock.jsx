import React from "react";
import { Link } from "react-router-dom";

function TextBlock() {
  return (
    <div className="h-dvh bg-[#210002] flex flex-col justify-between animate-fadeIn">
      <div className="w-2/3 mx-auto flex flex-col items-center justify-center h-[100%]">
        <div className="text-center space-y-6">
          <p className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl  mb-15 pb-5 font-bold tracking-wide ml-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-blue-400 leading-relaxed">
            Discover the finest hiking trails in New York City with HikerAI.
            Enjoy the great outdoors without any hassle — we've got you covered.
          </p>
          <Link to="/assistant">
            <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600  text-white py-3 px-8 rounded-2xl text-xs sm:text-md md:text-lg font-semibold shadow-lg transform transition-transform hover:scale-105 mt-10 sm:mt-20 animate-bounceIn">
              Find a Hiking Trail
            </button>
          </Link>
        </div>
      </div>
      <footer className="w-full flex justify-center items-center text-center text-yellow-300 text-xs font-normal py-2 bg-gray-900 bg-opacity-50 border-t border-yellow-300">
        Created with ❤️ by the HikerAI Team
      </footer>
    </div>
  );
}

export default TextBlock;
