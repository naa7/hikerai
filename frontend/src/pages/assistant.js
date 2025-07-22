import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaSquare, FaUserCircle } from "react-icons/fa";
import { MdAssistant } from "react-icons/md";
import logo from "../images/hikerai.png";
import RatingStars from "../components/RatingStars";
import RenderMarkdown from "../components/RenderMarkdown";
import CopyToClipboard from "../components/CopyToClipboard";
import AssistantHeader from "../components/AssistantHeader";

import {
  sendChatMessage,
  stopBotTyping,
  cancelSearch,
} from "../utils/chatUtils";

import "../customScrollbar.css";

function AssistantPage() {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchCanceled, setSearchCanceled] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [isInputMultiline, setIsInputMultiline] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [textAreaHeight, setTextAreaHeight] = useState(
    window.innerWidth <= 768 ? "57px" : "65px"
  );
  const [paddingHeight, setPaddingHeight] = useState(
    window.innerWidth <= 768 ? "13px" : "16.5px"
  );

  useEffect(() => {
    if (!isSearching) {
      setSearchCanceled(false);
    }

    if (searchCanceled) {
      setIsSearching(false);
    }

    const handleResize = () => {
      setTextAreaHeight(window.innerWidth <= 768 ? "57px" : "65px");
      setPaddingHeight(window.innerWidth <= 768 ? "13px" : "16.5px");
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSearching, searchCanceled]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = textAreaHeight;
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        57
      )}px`;

      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setShowScrollbar(textareaRef.current.scrollHeight > 250);
      setIsInputMultiline(textareaRef.current.scrollHeight > 65);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(
        isSearching,
        setIsSearching,
        inputMessage,
        setInputMessage,
        chatMessages,
        setChatMessages,
        searchCanceled,
        setSearchCanceled,
        setIsBotTyping,
        setIntervalId,
        textareaRef,
        textAreaHeight,
        setShowScrollbar
      );
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  scrollToBottom();

  const isSearchDisabled = inputMessage.trim() === "";

  return (
    <div className="flex flex-col min-h-screen bg-[#1F1F1F] text-gray-200 relative font-inter">
      <AssistantHeader />

      <div
        ref={chatContainerRef}
        className="flex-1 font-sans mt-20 mb-20 overflow-y-auto px-[6.5%] xl:px-[28.3%] py-8 pb-[120px] whitespace-pre-wrap"
      >
        {chatMessages.length === 0 ? (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col justify-center items-center">
              <img src={logo} alt="logo" className="relative" />
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-10 pb-3 font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-blue-400 cursor-default">
                How can I help you?
              </p>
            </div>
          </div>
        ) : (
          chatMessages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="sm:mr-11 mr-9 py-4 px-6 max-w-[80%] sm:max-w-[90%] xl:max-w-[91%] rounded-3xl overflow-hidden m-2 bg-[#333333]  text-md sm:text-lg">
                    {message.response && <div>{message.response}</div>}
                  </div>
                  <FaUserCircle className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full mt-5" />
                </div>
              ) : (
                <div className="flex flex-col justify-start relative">
                  <MdAssistant className="absolute  w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 mt-6" />

                  <div className="sm:ml-11 ml-9 py-1 px-1 max-w-[80%] sm:max-w-[90%] xl:max-w-[91%] rounded-3xl overflow-hidden mt-2 text-md sm:text-lg">
                    {typeof message.response === "object" ? (
                      <div className="flex flex-col sm:flex-row">
                        {message.response.image && (
                          <div className="h-[20rem] w-full flex-shrink-0 sm:w-1/2 sm:h-auto">
                            <img
                              src={message.response.image}
                              alt="Trail"
                              className="h-full w-full object-cover rounded-2xl"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://www.elachee.org/wp-content/uploads/2022/06/Chicopee-Woods-Hiking-Trails-dodd-m.jpg";
                              }}
                            />
                          </div>
                        )}
                        <div className="py-4 px-5 flex flex-col justify-center">
                          {message.response.name && (
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
                              {message.response.name}
                            </h2>
                          )}
                          {message.response.address && (
                            <div className="flex flex-row">
                              <strong className="mr-2">Address:</strong>{" "}
                              <a
                                href={message.response.url}
                                target="_blank"
                                rel="noreferrer"
                                className="cursor-pointer hover:underline transition duration-300 text-blue-400 hover:text-blue-600"
                              >
                                <p className="text-md mb-3">
                                  {message.response.address}
                                </p>
                              </a>
                            </div>
                          )}
                          {message.response.difficulty && (
                            <p className="text-md mb-3">
                              <strong>Difficulty:</strong>{" "}
                              {message.response.difficulty}
                            </p>
                          )}
                          {message.response.surface && (
                            <p className="text-md mb-3">
                              <strong>Surface:</strong>{" "}
                              {message.response.surface}
                            </p>
                          )}
                          {message.response.ratings && (
                            <RatingStars rating={message.response.ratings} />
                          )}
                          {message.response.summary && (
                            <p className="text-md mb-3">
                              <strong>Description:</strong>{" "}
                              {message.response.summary}
                            </p>
                          )}
                          {message.response.reviews && (
                            <p className="text-md mb-3">
                              <strong>Reviews:</strong>{" "}
                              {message.response.reviews.split("\n")[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-3 px-3">
                        <RenderMarkdown
                          children={message.response}
                          isBotTyping={isBotTyping}
                        />
                      </div>
                    )}
                  </div>
                  {typeof message.response !== "object" && (
                    <CopyToClipboard
                      text={message.response}
                      isBotTyping={isBotTyping}
                    />
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-center px-6 pt-6 bg-[#1F1F1F] transition duration-300">
        <div className="relative w-full lg:w-[92%] xl:w-[45%]">
          <textarea
            ref={textareaRef}
            className={
              "w-full font-medium text-md sm:text-lg py-2 pl-6 pr-16 bg-[#2e2e2e] hover:border-2 hover:border-[#666666] text-white  border-[#333333] focus:outline-none resize-none placeholder-[#888888] transition duration-300 " +
              (isInputMultiline ? "rounded-3xl" : "rounded-full")
            }
            placeholder="Message HikerAI"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{
              overflowY: showScrollbar ? "auto" : "hidden",
              maxHeight: "250px",
              height: textAreaHeight,
              lineHeight: "30px",
              paddingTop: paddingHeight,
              paddingBottom: paddingHeight,
              boxSizing: "border-box",
              background: "#333333",
            }}
          />

          <button
            className={`absolute w-9 h-9 right-3.5 bottom-[1.1rem] sm:bottom-[0.95rem] md:bottom-[1.2rem] ml-2 px-3 py-3 bg-white text-black rounded-full hover:bg-gray-300 focus:outline-none flex items-center justify-center ${
              isSearchDisabled && !isSearching
                ? "opacity-20 bg-gray-300 hover:bg-gray-300 cursor-default"
                : ""
            } ${"sm:w-10 sm:h-10 sm:ml-0.5"}`}
            onClick={() => {
              if (isSearching) {
                cancelSearch(setIsSearching, setSearchCanceled);
              }

              if (isBotTyping) {
                stopBotTyping(setIsBotTyping, intervalId, setIntervalId);
                cancelSearch(setIsSearching, setSearchCanceled);
              }

              sendChatMessage(
                isSearching,
                setIsSearching,
                inputMessage,
                setInputMessage,
                chatMessages,
                setChatMessages,
                searchCanceled,
                setSearchCanceled,
                setIsBotTyping,
                setIntervalId,
                textareaRef,
                textAreaHeight,
                setShowScrollbar
              );
            }}
            disabled={isSearchDisabled && !isSearching}
          >
            {isSearching ? (
              <FaSquare className="animate-pulse text-gray-800 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <FaArrowUp className="flex-shrink-0 w-4 h-5" />
            )}
          </button>
        </div>
        <p className="cursor-default p-1 pb-2 text-[12px] sm:text-[14px] text-[#a8a8a8]">
          HikerAI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default AssistantPage;
