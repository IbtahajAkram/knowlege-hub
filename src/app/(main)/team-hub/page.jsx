"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FileArchiveIcon, Send, SendHorizonal, Upload } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);
  const filesUplaods = useRef(null)
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("chatUser");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(storedUser);
      fetchMessages();
    }
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get("https://a69094484e04.ngrok-free.appmessages");
    setMessages(res.data);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!message) return;
    await axios.post("https://a69094484e04.ngrok-free.appmessage", { user, message });
    setMessage("");
    fetchMessages();
  };

  const uploadFile = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("user", user);
    await axios.post("https://a69094484e04.ngrok-free.appupload", form);
    setFile(null);
    filesUplaods.current.value = null;
    fetchMessages();
  };

  return (
    <div className="min-h-screen mt-18 bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-blue-100">
       {/* <div></div> */}
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-700 animate-bounce">
         Welcome to Chat Room
        </h1>
                <div className="h-96 overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4 mb-6 shadow-inner">
          {messages.length === 0 ? (
            <p className="text-gray-400 italic text-center">Start the conversation 💬</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.user === user ? "items-end" : "items-start"}`}
              >
                <div className={`rounded-2xl px-5 py-2 text-sm shadow-md max-w-xs ${msg.user === user ? "bg-blue-100 text-left text-blue-800" : "bg-green-100 text-left text-green-800"}`}>
                  <strong>{msg.user}</strong>
                  <div>
                    {msg.message ? (
                      <span>{msg.message}</span>
                    ) : (
                      <a
                        href={`https://a69094484e04.ngrok-free.app${msg.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 flex mt-2 gap-[5px] "
                      >
                        <FileArchiveIcon className="-mt-1"/> File Attached
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=" Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-700 to-blue-600 flex justify-center text-center gap-2 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition shadow-md"
          >
            Send <SendHorizonal className="w-5 h-5 mt-0.5"/>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="file"
            ref={filesUplaods}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-indigo-100 file:text-indigo-700"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={uploadFile}
            className="bg-green-600 flex gap-2 text-white px-6 py-2 rounded-full hover:bg-green-600 transition shadow-md"
          >
            <Upload className="w-5 h-5 mt-0.5"/> Upload
          </button>
        </div>
      </div>
    </div>
  );
}