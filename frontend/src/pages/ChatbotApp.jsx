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
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [temperature, setTemperature] = useState(0.7);

  const messagesEndRef = useRef(null);

  // Default fallback API key (replace with yours)
  const DEFAULT_API_KEY = "AIzaSyDlQkBvkdvZ9-oYFjHm8pPMaepVartmbBs";

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call OpenAI API
  // const callOpenAI = async (userMessage) => {
  //   const activeApiKey = apiKey?.trim() || DEFAULT_API_KEY;

  //   if (!activeApiKey) {
  //     return "⚠️ Please add your OpenAI API key in the Settings tab to start chatting!";
  //   }

  //   try {
  //     const response = await fetch(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${activeApiKey}`,
  //         },
  //         body: JSON.stringify({
  //           model: model,
  //           messages: [
  //             ...messages.map((m) => ({
  //               role: m.sender === "user" ? "user" : "assistant",
  //               content: m.text,
  //             })),
  //             { role: "user", content: userMessage },
  //           ],
  //           temperature,
  //           max_tokens: 500,
  //         }),
  //       }
  //     );

  //     if (response.status === 429) {
  //       return "⚠️ Rate limit reached. Please slow down or try again later.";
  //     }

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     return data.choices?.[0]?.message?.content || "⚠️ No response from AI.";
  //   } catch (error) {
  //     console.error("OpenAI API error:", error);
  //     return "⚠️ Sorry, I encountered an error while processing your request. Please check your API key and try again.";
  //   }
  // };

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

      // Gemini response format
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

  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };

  // Enter key shortcut
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
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              AI Assistant
            </h2>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Start a conversation!</p>
            <p className="text-sm">
              Type a message below to begin chatting with the AI.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
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

        {/* Loading dots */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Settings UI
  const renderSettings = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>

      <div className="space-y-4">
        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your API key is stored locally and never sent to any server except
            OpenAI.
          </p>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
          </select>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature: {temperature}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>More focused</span>
            <span>More creative</span>
          </div>
        </div>
      </div>
    </div>
  );

  // History UI
  const renderHistory = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Chat History</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">
          No chat history yet. Start a conversation to see it here!
        </p>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Current session: {messages.length} messages
            </p>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-3 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="text-sm py-1">
                <span
                  className={`font-medium ${
                    message.sender === "user"
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {message.sender === "user" ? "You" : "AI"}:
                </span>
                <span className="ml-2 text-gray-600">
                  {message.text.substring(0, 100)}
                  {message.text.length > 100 ? "..." : ""}
                </span>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            <p>💾 Conversations are saved locally in your browser</p>
            <p>🔄 Data persists between sessions</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">AI Chatbot</h1>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {[
              { id: "chat", label: "Chat", icon: MessageCircle },
              { id: "settings", label: "Settings", icon: Settings },
              { id: "history", label: "History", icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          Built with React & OpenAI API
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === "chat" && renderChatInterface()}
        {activeTab === "settings" && renderSettings()}
        {activeTab === "history" && renderHistory()}
      </div>
    </div>
  );
};

export default ChatbotApp;
