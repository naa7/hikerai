import axios from "axios";

const MODEL = "dolphin-phi";

const sendChatMessage = async (
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
) => {
  if (isSearching) {
    return;
  }

  if (inputMessage.trim() !== "") {
    const newUserMessage = { response: inputMessage.trim(), role: "user" };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");
    startSearch(setIsSearching, setSearchCanceled);
    setTimeout(async () => {
      if (!searchCanceled) {
        try {
          const lastFiveMessages = chatMessages.slice(-2);
          const history =
            lastFiveMessages.length >= 2 ? lastFiveMessages : chatMessages;
          const filteredHistory = history.filter(
            (message) => typeof message.response !== "object"
          );
          const response = await fetchChatResponse1(
            inputMessage.trim(),
            filteredHistory
          );
          if (!searchCanceled) {
            const botResponseMessage = {
              response: response.data.message.content,
              role: "assistant",
            };

            if (
              response.data.message.content &&
              typeof response.data.message.content === "object"
            ) {
              setChatMessages((prevMessages) => [
                ...prevMessages,
                botResponseMessage,
              ]);
              finishSearch(setIsSearching, setSearchCanceled);
            } else {
              displayBotResponse(
                botResponseMessage.response,
                setChatMessages,
                setIsBotTyping,
                setIntervalId,
                setIsSearching,
                setSearchCanceled
              );
            }
          }
        } catch (error) {
          console.error("Error sending message to chat:", error);
          displayBotResponse(
            "I'm sorry, I am not avaliable now.",
            setChatMessages,
            setIsBotTyping,
            setIntervalId,
            setIsSearching,
            setSearchCanceled
          );

          cancelSearch(setIsSearching, setSearchCanceled);
        }
      }
    }, 500);
  }

  if (textareaRef.current) {
    textareaRef.current.style.height = textAreaHeight;
    setShowScrollbar(false);
  }
};

const fetchChatResponse1 = async (inputMessage, filteredHistory) => {
  const response = await axios.post("http://localhost:11434/api/chat", {
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are HikerAI, an expert on hiking trails in New York City (NYC). Your role is to help users find the perfect hiking adventure in NYC. Ask about trail locations, difficulty levels, lengths, ratings, and any other hiking-related details. Provide clear, concise, and accurate responses. Only provide relevant information and do not hallucinate. When suggesting hiking trails, highlight the park's name in bold and list its details in an organized way. If unsure, say 'I don't know.' If users ask about conversation's history, you will share only the user's messages.",
      },

      ...filteredHistory.map((message) => ({
        role: message.role,
        content: message.text,
      })),
      { role: "user", content: inputMessage },
    ],
    stream: false,
    keep_alive: "10m",
  });
  return response;
};
// eslint-disable-next-line
const fetchChatResponse2 = async (inputMessage, filteredHistory) => {
  const url = "http://localhost:5000/query";
  const payload = {
    query: inputMessage.trim(),
    history: filteredHistory,
  };

  const response = await axios.post(url, payload);
  return response;
};

const displayBotResponse = (
  response,
  setChatMessages,
  setIsBotTyping,
  setIntervalId,
  setIsSearching,
  setSearchCanceled
) => {
  if (response) {
    const chunks = response.split(" ");
    let currentResponse = "";
    let index = 0;

    const id = setInterval(() => {
      if (index < chunks.length) {
        currentResponse += `${chunks[index]} `;
        setChatMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          if (
            newMessages.length > 0 &&
            newMessages[newMessages.length - 1].role === "assistant"
          ) {
            newMessages[newMessages.length - 1].response = currentResponse;
          } else {
            newMessages.push({
              role: "assistant",
              response: currentResponse,
            });
          }
          return newMessages;
        });

        index++;
      } else {
        clearInterval(id);
        finishSearch(setIsSearching, setSearchCanceled);
        setIsBotTyping(false);
      }
    }, 100);

    setIntervalId(id);
    setIsBotTyping(true);
  } else {
    console.error("Received an undefined or null response");
  }
};

const stopBotTyping = (setIsBotTyping, intervalId, setIntervalId) => {
  setIsBotTyping(false);
  clearInterval(intervalId);
  setIntervalId(null);
};

const startSearch = (setIsSearching, setSearchCanceled) => {
  setIsSearching(true);
  setSearchCanceled(false);
};

const finishSearch = (setIsSearching, setSearchCanceled) => {
  setIsSearching(false);
  setSearchCanceled(false);
};

const cancelSearch = (setIsSearching, setSearchCanceled) => {
  setSearchCanceled(true);
  setIsSearching(false);
};

export { sendChatMessage, stopBotTyping, cancelSearch };
