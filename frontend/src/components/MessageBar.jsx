// import React, { useState, useRef, useEffect } from "react";
// import { FaArrowUp, FaSquare } from "react-icons/fa";
// import {
//   sendChatMessage,
//   stopBotTyping,
//   cancelSearch,
// } from "../utils/chatUtils";

// const MessageBar = ({
//   chatMessages,
//   setChatMessages,
//   chatContainerRef,
//   isBotTyping,
//   setIsBotTyping,
//   isSearching,
//   setIsSearching,
//   searchCanceled,
//   setSearchCanceled,
// }) => {
//   const [inputMessage, setInputMessage] = useState("");
//   const [showScrollbar, setShowScrollbar] = useState(false);
//   const [isInputMultiline, setIsInputMultiline] = useState(false);
//   const [intervalId, setIntervalId] = useState(null);
//   const textareaRef = useRef(null);
//   const [textAreaHeight, setTextAreaHeight] = useState(
//     window.innerWidth <= 768 ? "57px" : "65px"
//   );
//   const [paddingHeight, setPaddingHeight] = useState(
//     window.innerWidth <= 768 ? "13px" : "16.5px"
//   );

//   useEffect(() => {
//     const handleResize = () => {
//       setTextAreaHeight(window.innerWidth <= 768 ? "57px" : "65px");
//       setPaddingHeight(window.innerWidth <= 768 ? "13px" : "16.5px");
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop =
//           chatContainerRef.current.scrollHeight;
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [chatContainerRef]);

//   const handleInputChange = (e) => {
//     setInputMessage(e.target.value);
//     if (textareaRef.current) {
//       textareaRef.current.style.height = textAreaHeight;
//       textareaRef.current.style.height = `${Math.max(
//         textareaRef.current.scrollHeight,
//         57
//       )}px`;

//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//       setShowScrollbar(textareaRef.current.scrollHeight > 250);
//       setIsInputMultiline(textareaRef.current.scrollHeight > 65);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendChatMessage(
//         isSearching,
//         setIsSearching,
//         inputMessage,
//         setInputMessage,
//         chatMessages,
//         setChatMessages,
//         searchCanceled,
//         setSearchCanceled,
//         setIsBotTyping,
//         setIntervalId,
//         textareaRef,
//         textAreaHeight,
//         setShowScrollbar
//       );
//     }
//   };

//   const isSearchDisabled = inputMessage.trim() === "";

//   return (
//     <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-center px-6 pt-6 bg-[#1F1F1F] transition duration-300">
//       <div className="relative w-full lg:w-[92%] xl:w-[45%]">
//         <textarea
//           ref={textareaRef}
//           className={
//             "w-full font-medium text-md sm:text-lg py-2 pl-6 pr-16 bg-[#2e2e2e] hover:border-2 hover:border-[#666666] text-white  border-[#333333] focus:outline-none resize-none placeholder-[#888888] transition duration-300 " +
//             (isInputMultiline ? "rounded-3xl" : "rounded-full")
//           }
//           placeholder="Message HikerAI"
//           value={inputMessage}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           style={{
//             overflowY: showScrollbar ? "auto" : "hidden",
//             maxHeight: "250px",
//             height: textAreaHeight,
//             lineHeight: "30px",
//             paddingTop: paddingHeight,
//             paddingBottom: paddingHeight,
//             boxSizing: "border-box",
//             background: "#333333",
//           }}
//         />

//         <button
//           className={`absolute w-9 h-9 right-3.5 bottom-[1.1rem] sm:bottom-[0.95rem] md:bottom-[1.2rem] ml-2 px-3 py-3 bg-white text-black rounded-full hover:bg-gray-300 focus:outline-none flex items-center justify-center ${
//             isSearchDisabled && !isSearching
//               ? "opacity-20 bg-gray-300 hover:bg-gray-300 cursor-default"
//               : ""
//           } ${"sm:w-10 sm:h-10 sm:ml-0.5"}`}
//           onClick={() => {
//             if (isSearching) {
//               cancelSearch(setIsSearching, setSearchCanceled);
//             }

//             if (isBotTyping) {
//               stopBotTyping(setIsBotTyping, intervalId, setIntervalId);
//               cancelSearch(setIsSearching, setSearchCanceled);
//             }

//             sendChatMessage(
//               isSearching,
//               setIsSearching,
//               inputMessage,
//               setInputMessage,
//               chatMessages,
//               setChatMessages,
//               searchCanceled,
//               setSearchCanceled,
//               setIsBotTyping,
//               setIntervalId,
//               textareaRef,
//               textAreaHeight,
//               setShowScrollbar
//             );
//           }}
//           disabled={isSearchDisabled && !isSearching}
//         >
//           {isSearching ? (
//             <FaSquare className="animate-pulse text-gray-800 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
//           ) : (
//             <FaArrowUp className="flex-shrink-0 w-4 h-5" />
//           )}
//         </button>
//       </div>
//       <p className="cursor-default p-1 pb-2 text-[12px] sm:text-[14px] text-[#a8a8a8]">
//         HikerAI can make mistakes. Check important info.
//       </p>
//     </div>
//   );
// };

// export default MessageBar;
