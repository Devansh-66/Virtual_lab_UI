import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Image as ImageIcon, Loader2, Clock, Trash2, Menu } from "lucide-react";
import { useTheme } from "next-themes";

const AIAssistantModal = ({ onClose, moduleContext, onApplyResponse }) => {
  const { resolvedTheme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("text");
  const [selectedImage, setSelectedImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typingText, setTypingText] = useState("");

  const fileInputRef = useRef(null);

  const aiConfig = {
    text: {
      model: "DeepSeek-R1-8B (Text)",
      inferenceTime: "1-2s",
      endpoint: "http://localhost:8000/api/ai-assistant",
    },
    imageToText: {
      model: "BLIP-2 (Image)",
      inferenceTime: "500-1000ms",
      endpoint: "http://localhost:8000/api/image-to-text",
    },
    objectDetection: {
      model: "YOLOv8m",
      inferenceTime: "50-100ms",
      endpoint: "http://localhost:8000/api/object-detection",
    },
  };

  const MAX_CHATS = 10;
  const MAX_MESSAGES_TOTAL = 100;

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(storedChats);
    if (storedChats.length > 0) {
      setActiveChatId(storedChats[0].id);
      setMessages(storedChats[0].messages || []);
    }
    checkStorageLimits();
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
    checkStorageLimits();
  }, [chatHistory]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const startNewChat = () => {
    if (chatHistory.length >= MAX_CHATS) {
      alert(`Maximum chat limit (${MAX_CHATS}) reached. Please delete old chats to continue.`);
      return;
    }
    const nextNumber = Math.max(...chatHistory.map((chat) => parseInt(chat.title.match(/Chat (\d+)/)?.[1] || 0)), 0) + 1;
    const newChat = {
      id: Date.now(),
      title: `Chat ${nextNumber}`,
      startTime: new Date().toLocaleString(),
      messages: [],
    };
    setChatHistory((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessages([]);
    setSidebarOpen(false);
  };

  const simulateTyping = (fullText, onComplete) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypingText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTypingText("");
        if (onComplete) onComplete();
      }
    }, 50);
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;
    setLoading(true);
    setTypingText("");

    const userMessage = {
      sender: "user",
      text: input,
      image: selectedImage,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (!activeChatId) startNewChat();

    setMessages((prev) => [...prev, userMessage]);
    setChatHistory((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId ? { ...chat, messages: [...(chat.messages || []), userMessage] } : chat
      )
    );

    const currentConfig = aiConfig[selectedModel];
    let requestBody = {};
    let headers = { "Content-Type": "application/json" };
    const endpoint = currentConfig.endpoint;

    if (selectedModel === "text") {
      requestBody = { message: input, context: moduleContext };
    } else if (selectedModel === "imageToText" || selectedModel === "objectDetection") {
      if (!selectedImage) {
        const errorMsg = {
          sender: "assistant",
          text: "Please upload an image.",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: [...(chat.messages || []), errorMsg] } : chat
          )
        );
        setLoading(false);
        return;
      }
      requestBody = new FormData();
      try {
        const blob = await (await fetch(selectedImage)).blob();
        requestBody.append("file", blob, "image.jpg");
        headers = {};
      } catch (e) {
        console.error("Blob conversion error:", e);
        const errorMsg = {
          sender: "assistant",
          text: "Error: Failed to process image upload.",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: [...(chat.messages || []), errorMsg] } : chat
          )
        );
        setLoading(false);
        return;
      }
    }

    try {
      console.log("Sending request to:", endpoint);
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: selectedModel === "text" ? JSON.stringify(requestBody) : requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      let done = false;

      while (!done) {
        try {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((line) => line.trim());
            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                if (data.done) {
                  done = true;
                  const assistantMessage = {
                    sender: "assistant",
                    text: fullResponse,
                    timestamp: new Date().toLocaleTimeString(),
                  };
                  setMessages((prev) => [...prev, assistantMessage]);
                  setChatHistory((prev) =>
                    prev.map((chat) =>
                      chat.id === activeChatId ? { ...chat, messages: [...(chat.messages || []), assistantMessage] } : chat
                    )
                  );
                  setTypingText("");
                  break;
                }
                const chunkText = data.response || data.description || data.detected_objects || data.error || "";
                fullResponse += chunkText;
                setTypingText(fullResponse);
              } catch (e) {
                console.error("Error parsing chunk:", line, e);
              }
            }
          }
        } catch (e) {
          console.error("Stream reading interrupted:", e);
          done = true;
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        sender: "assistant",
        text: `Error: ${error.message || "Failed to process request. Check server status."}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      simulateTyping(errorMessage.text, () => {
        setMessages((prev) => [...prev, errorMessage]);
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId ? { ...chat, messages: [...(chat.messages || []), errorMessage] } : chat
          )
        );
      });
    } finally {
      setInput("");
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setLoading(false);
    }
  };

  const switchChat = (chatId) => {
    setActiveChatId(chatId);
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    setMessages(selectedChat?.messages || []);
    setSidebarOpen(false);
  };

  const deleteChat = (chatId) => {
    if (window.confirm(`Are you sure you want to delete Chat ${chatHistory.findIndex((chat) => chat.id === chatId) + 1}?`)) {
      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
      if (chatHistory.length <= 1) localStorage.removeItem("chatHistory");
    }
  };

  const checkStorageLimits = () => {
    const totalMessages = chatHistory.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0);
    if (chatHistory.length >= MAX_CHATS - 1 || totalMessages >= MAX_MESSAGES_TOTAL - 10) {
      alert(
        `Storage warning: You are nearing the limit (${MAX_CHATS} chats or ${MAX_MESSAGES_TOTAL} messages). Consider deleting old chats to free up space.`
      );
    }
  };

  return (
    <div className={`fixed inset-0 ${resolvedTheme === "dark" ? "bg-black bg-opacity-60" : "bg-gray-200 bg-opacity-60"} flex items-center justify-center z-[1500] transition-opacity duration-300`}>
      <div className={`${resolvedTheme === "dark" ? "bg-gray-900" : "bg-white"} rounded-xl shadow-2xl w-full max-w-4xl h-[100vh] flex transform transition-all duration-300 scale-100 hover:scale-[1.01]`}>
        {sidebarOpen && (
          <div
            className={`fixed inset-0 ${resolvedTheme === "dark" ? "bg-black" : "bg-gray-500"} bg-opacity-50 z-10`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full rounded-r-xl ${resolvedTheme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-gray-900 border-gray-300"} border-r overflow-y-auto transition-transform duration-300 z-20 ${sidebarOpen ? "translate-x-0" : "hidden"}`}
          style={{ width: "250px" }}
        >
          <div className={`p-4 flex justify-between items-center ${resolvedTheme === "dark" ? "border-gray-700" : "border-gray-300"} border-b`}>
            <h3 className="text-lg font-semibold">Chat History</h3>
            <button onClick={() => setSidebarOpen(false)} className={`${resolvedTheme === "dark" ? "text-white hover:text-gray-300" : "text-gray-900 hover:text-gray-600"}`}>
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <button
              onClick={startNewChat}
              className={`w-full mb-4 ${resolvedTheme === "dark" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 rounded-lg text-sm transition-colors`}
            >
              New Chat
            </button>
            {chatHistory.length === 0 ? (
              <p className={`${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"} text-center text-sm`}>No chats yet</p>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => switchChat(chat.id)}
                  className={`p-2 mb-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    activeChatId === chat.id
                      ? resolvedTheme === "dark"
                        ? "bg-purple-600 text-white"
                        : "bg-blue-500 text-white"
                      : resolvedTheme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={`${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
                    <span className="font-medium">{chat.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className={`${resolvedTheme === "dark" ? "text-red-400 hover:text-red-500" : "text-red-600 hover:text-red-700"}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className={`flex items-center justify-between ${resolvedTheme === "dark" ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-gray-900"} border-b p-4`}>
            <div className="flex items-center gap-2">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`${resolvedTheme === "dark" ? "text-white hover:text-gray-300" : "text-gray-900 hover:text-gray-600"}`}>
                <Menu size={20} />
              </button>
              <Bot className={`${resolvedTheme === "dark" ? "text-purple-600" : "text-blue-600"}`} size={24} />
              <h3 className="text-lg font-semibold">Virtual Labs AI Assistant</h3>
            </div>
            <button onClick={onClose} className={`${resolvedTheme === "dark" ? "text-white hover:text-gray-300" : "text-gray-900 hover:text-gray-600"}`}>
              <X size={24} />
            </button>
          </div>

          <div className={`${resolvedTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-200 border-gray-300"} p-3 flex gap-3 border-b`}>
            {Object.entries(aiConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedModel(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedModel === key
                    ? resolvedTheme === "dark"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-blue-500 text-white shadow-md"
                    : resolvedTheme === "dark"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
                title={`${config.model} - ${config.inferenceTime}`}
              >
                {config.model}
              </button>
            ))}
          </div>

          <div className={`flex-1 p-6 overflow-y-auto ${resolvedTheme === "dark" ? "text-white" : "text-gray-900"}`}>
            {loading && (
              <div className={`text-center ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4 text-sm`}>
                Processing with {aiConfig[selectedModel].model} ({aiConfig[selectedModel].inferenceTime})...
              </div>
            )}
            {messages.length === 0 && !typingText ? (
              <div className={`text-center ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"} mt-10 text-sm`}>
                Start by typing a message or uploading an image!
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[70%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-8 h-8 flex items-center justify-center ${resolvedTheme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {message.sender === "user" ? "You" : "AI"}
                      </div>
                      <div>
                        {message.image && (
                          <img src={message.image} alt="Uploaded" className="max-w-[200px] rounded-lg mb-2 shadow-sm" />
                        )}
                        <div
                          className={`p-3 rounded-lg shadow-sm break-words max-w-prose ${
                            message.sender === "user"
                              ? resolvedTheme === "dark"
                                ? "bg-purple-500 text-white"
                                : "bg-blue-400 text-white"
                              : resolvedTheme === "dark"
                              ? "bg-gray-700 text-gray-100"
                              : "bg-gray-200 text-gray-800"
                          }`}
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          {message.text}
                        </div>
                        <span className={`text-xs ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {typingText && (
                  <div className="mb-4 flex justify-start">
                    <div className="flex items-start gap-2 max-w-[70%]">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${resolvedTheme === "dark" ? "text-white bg-gray-600" : "text-gray-900 bg-gray-300"}`}>
                        AI
                      </div>
                      <div>
                        <div
                          className={`p-3 rounded-lg shadow-sm break-words max-w-prose ${resolvedTheme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-200 text-gray-800"}`}
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          {typingText}
                          <span className="animate-pulse">|</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className={`border-t ${resolvedTheme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-white"} p-4 flex items-center gap-3`}>
            {(selectedModel === "imageToText" || selectedModel === "objectDetection") && (
              <label className={`cursor-pointer ${resolvedTheme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} p-2 rounded-full transition-colors`}>
                <ImageIcon size={20} className={`${resolvedTheme === "dark" ? "text-gray-200" : "text-gray-700"}`} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
              </label>
            )}
            {selectedImage && (
              <div className="relative">
                <img src={selectedImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              className={`flex-1 p-3 rounded-lg border ${resolvedTheme === "dark" ? "border-gray-600 bg-gray-800 text-white focus:ring-purple-500" : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500"} resize-none focus:outline-none focus:ring-2`}
              rows={2}
              placeholder={
                selectedModel === "text" ? "Ask for code, suggestions, or help..." : "Upload an image to process..."
              }
            />
            <button
              onClick={handleSendMessage}
              className={`${resolvedTheme === "dark" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-500 hover:bg-blue-600"} text-white p-3 rounded-full disabled:opacity-50 transition-colors`}
              disabled={loading}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;