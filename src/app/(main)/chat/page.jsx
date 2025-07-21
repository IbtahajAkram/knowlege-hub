"use client";
import { ChartArea, ChartBar, MessageCircle, MessageCircleCode } from "lucide-react";
import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);
    const botMessage = { sender: "bot", text: "" };
    setMessages((prev) => [...prev, botMessage]);
    const botIndex = messages.length + 1;

    try {
      const response = await fetch("https://eaa96d7f64c0.ngrok-free.app/ai/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop();

        chunks.forEach((chunk) => {
          if (chunk.startsWith("data: ")) {
            const data = chunk.replace("data: ", "").trim();
            if (data === "[DONE]") return;

            setMessages((prev) => {
              const updated = [...prev];
              updated[botIndex] = {
                sender: "bot",
                text: (updated[botIndex]?.text || "") + data,
              };
              return updated;
            });
          }
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
    }

    setIsTyping(false);
  };

  return (
<div className="flex flex-col items-center mt-20 justify-center min-h-screen bg-white p-6">
  <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20">
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-600 p-5 flex items-center justify-center flex-col text-white shadow-lg">
      <h1 className="text-3xl font-extrabold tracking-wide flex items-center gap-2">
        <MessageCircleCode className="text-3xl w-8 h-8" />
        AI Virtual Assistent
      </h1>
      <p className="text-base text-white opacity-80">Smart conversations powered by AI</p>
    </div>


    {/* Chat Window */}
    <div className="h-[28rem] overflow-y-auto p-5 bg-gradient-to-b from-gray-100 to-gray-50">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex my-2 ${
            msg.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-md transition ${
              msg.sender === "user"
                ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-900 rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
      {messages.length === 0 && (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 animate-fade-in">
    <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white p-4 rounded-full shadow-lg mb-4">
      <MessageCircleCode className="w-10 h-10" />
    </div>
    <h2 className="text-xl font-bold">Welcome to Virtual Assistent AI Chatbot</h2>
    <p className="text-sm mt-1 opacity-80">
      Ask me anything, and I'll do my best to help you!
    </p>
  </div>
)}
      {isTyping && (
        <div className="text-blue-600 flex italic animate-pulse mt-2">
           typing <span className="animate-bounce">...</span>
        </div>
      )}
    </div>

    {/* Input Area */}
    <div className="flex p-4 bg-gray-100 border-t border-gray-300">
      <input
        className="flex-grow px-4 py-2.5 text-gray-700 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-600 border border-gray-300 shadow-inner"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        className="bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold px-6 py-3 rounded-r-2xl transition duration-200 shadow-lg"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  </div>
</div>


  );
};

export default Chatbot;
