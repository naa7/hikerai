import React, { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
const ScrollingArrow = ({ targetRef }) => {
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const handleScroll = (chatContainerRef) => {
      if (targetRef.current) {
        const currentScroll = targetRef.current.current;
        if (currentScroll >= 1) {
          setShowArrow(false);
        } else {
          setShowArrow(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetRef]);

  const handleScrollDown = () => {
    if (targetRef.current) {
      targetRef.current.scrollTo(1);
    }
  };

  return (
    <>
      {showArrow && (
        <div
          className="z-50 cursor-pointer flex justify-center items-center"
          onClick={handleScrollDown}
        >
          <FaArrowDown
            className="text-white bg-black bg-opacity-50 rounded-full p-2 animate-bounce"
            size={42}
          />
        </div>
      )}
    </>
  );
};

export default ScrollingArrow;
