import { useState, useEffect } from "react";
import { BiSolidCopy } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

const CopyToClipboard = ({ text, id, isBotTyping }) => {
  const [copied, setCopied] = useState(false);
  const [showButton, setShowButton] = useState(!isBotTyping);

  useEffect(() => {
    if (!isBotTyping) {
      setShowButton(true);
    }
  }, [isBotTyping]);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Error copying text to clipboard:", error);
    }
  };

  if (!showButton) {
    return null;
  }

  return (
    <div>
      {!copied ? (
        <button
          className="ml-12 sm:ml-14 relative rounded-2xl w-7 h-7 flex items-center justify-center text-white opacity-70 hover:opacity-100 focus:outline-none"
          alt="Copy"
          onClick={handleCopy}
        >
          {!copied && <BiSolidCopy />}
        </button>
      ) : (
        <div className="flex justify-end items-center ml-12 sm:ml-14 p-1 cursor-default w-20 rounded-2xl ">
          <FaCheckCircle className="" />
          <span className="ml-1 text-xs text-white rounded-lg p-1">
            Copied!
          </span>
        </div>
      )}
    </div>
  );
};

export default CopyToClipboard;
