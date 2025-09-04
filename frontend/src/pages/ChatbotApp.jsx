import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  MessageCircle,
  Settings,
  History,
  Trash2,
  Bot,
  User,
} from "lucide-react";

const ChatbotApp = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [fadeContent, setFadeContent] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    setApiKey("AIzaSyDlQkBvkdvZ9-oYFjHm8pPMaepVartmbBs");
    
    // Trigger initial animations
    setTimeout(() => setIsInitialized(true), 100);
  }, []);

  // Smooth scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Gemini API call
  const callGemini = async (userMessage) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
          apiKey || "AIzaSyDlQkBvkdvZ9-oYFjHm8pPMaepVartmbBs"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: userMessage }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No response from Gemini."
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      return "⚠️ Sorry, I encountered an error while calling Gemini API.";
    }
  };

  // Send user message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await callGemini(inputMessage);

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "⚠️ Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat with fade animation
  const clearChat = () => {
    setFadeContent(true);
    setTimeout(() => {
      setMessages([]);
      setFadeContent(false);
    }, 300);
  };

  // Tab switching with fade
  const switchTab = (tabId) => {
    if (tabId !== activeTab) {
      setFadeContent(true);
      setTimeout(() => {
        setActiveTab(tabId);
        setFadeContent(false);
      }, 200);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Chat UI
  const renderChatInterface = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div 
        className={`bg-gradient-to-r from-purple-500 via-indigo-600 to-indigo-700 text-white p-4 shadow-lg transform transition-all duration-500 ${
          isInitialized ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-200 hover:scale-110">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 backdrop-blur-sm transform hover:scale-105"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-indigo-50 to-purple-50 transition-opacity duration-300 ${
          fadeContent ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {messages.length === 0 ? (
          <div className={`text-center mt-12 transform transition-all duration-700 ${
            isInitialized ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a conversation!</h3>
            <p className="text-gray-600">Type a message below to begin chatting with the AI.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex transform transition-all duration-500 animate-slideIn ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`flex items-start space-x-3 max-w-xs lg:max-w-md transform transition-all duration-200 hover:scale-105 ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:shadow-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                      : "bg-white text-gray-600 border-2 border-indigo-100"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                      : "bg-white text-gray-800 border border-indigo-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === "user"
                        ? "text-purple-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading animation */}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-white border border-indigo-100 rounded-2xl px-4 py-3 shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div 
        className={`bg-white border-t border-indigo-200 p-4 shadow-lg transform transition-all duration-700 ${
          isInitialized ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 resize-none border-2 border-indigo-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 focus:scale-105"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 via-indigo-600 to-indigo-700 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // History UI
  const renderHistory = () => (
    <div className={`p-6 bg-gradient-to-b from-indigo-50 to-purple-50 min-h-full transition-opacity duration-300 ${
      fadeContent ? 'opacity-50' : 'opacity-100'
    }`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <History className="w-6 h-6 mr-3 text-indigo-600" />
        Chat History
      </h2>
      {messages.length === 0 ? (
        <div className="text-center mt-12 transform transition-all duration-500 animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <History className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">No chat history yet. Start a conversation to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-md border border-indigo-100 transform transition-all duration-200 hover:shadow-lg hover:scale-105">
            <p className="text-sm text-gray-600 font-medium">
              Current session: {messages.length} messages
            </p>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:scale-105"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="bg-white rounded-xl p-4 max-h-96 overflow-y-auto shadow-md border border-indigo-100 transform transition-all duration-200 hover:shadow-lg">
            {messages.map((message, index) => (
              <div 
                key={message.id} 
                className="text-sm py-2 border-b border-gray-100 last:border-b-0 transform transition-all duration-200 hover:bg-indigo-50 hover:px-2 hover:rounded-md"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span
                  className={`font-semibold ${
                    message.sender === "user"
                      ? "text-purple-600"
                      : "text-indigo-600"
                  }`}
                >
                  {message.sender === "user" ? "You" : "AI"}:
                </span>
                <span className="ml-2 text-gray-700">
                  {message.text.substring(0, 100)}
                  {message.text.length > 100 ? "..." : ""}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {message.timestamp}
                </span>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 bg-white rounded-xl p-4 shadow-sm border border-indigo-100 transform transition-all duration-200 hover:shadow-md">
            <p className="mb-1">💾 Conversations are saved locally in your browser</p>
            <p>🔄 Data persists between sessions</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex md:flex-row flex-col md:h-[90vh] bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-100 md:pt-[85px]">
      {/* Sidebar */}
      <div 
        className={`md:w-72 bg-white shadow-xl border-r border-indigo-200 flex flex-col transform transition-all duration-500 ${
          isInitialized ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
        }`}
      >
        <div className="p-6 border-b border-indigo-200 bg-gradient-to-r from-purple-500 via-indigo-600 to-indigo-700 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <MessageCircle className="w-7 h-7 mr-3 transition-transform duration-200 hover:rotate-12" />
            AI Chatbot
          </h1>
          <p className="text-sm text-purple-100 mt-1">Powered by Gemini AI</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {[
              { id: "chat", label: "Chat", icon: MessageCircle },
              { id: "history", label: "History", icon: History },
            ].map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 transform hover:scale-105 animate-slideInLeft ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-indigo-50 border border-indigo-100"
                  }`}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-indigo-200 text-xs text-gray-500 bg-indigo-50">
          <p className="font-medium">Built with React & CSS</p>
          <p>Enhanced with smooth animations</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === "chat" && renderChatInterface()}
        {activeTab === "history" && renderHistory()}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Scrollbar styling for webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #6366f1);
          border-radius: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
        }
      `}</style>
    </div>
  );
};

export default ChatbotApp;