import { FaSpinner } from "react-icons/fa";

const ParallaxLoader = () => {
  return (
    <div className="w-full h-full bg-gray-900 fixed flex justify-center items-center">
      <div className="flex justify-center items-center">
        <FaSpinner className="text-white animate-spin" size={32} />
      </div>
    </div>
  );
};

export default ParallaxLoader;
