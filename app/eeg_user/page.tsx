"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, set, push } from "firebase/database";

export default function EEGUserPage() {
  const [emotion, setEmotion] = useState("Happy");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<any[]>([]);

  // 监听数据库中最新的对话内容
  useEffect(() => {
    const convoRef = ref(db, "conversation");
    const unsubscribe = onValue(convoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setConversation(Object.values(data));
      } else {
        setConversation([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // 发送消息
  const handleSend = async () => {
    if (!message.trim()) return;
    const convoRef = ref(db, "conversation");
    await push(convoRef, {
      sender: "EEG User",
      text: message,
      emotion,
      timestamp: Date.now(),
    });
    setMessage("");
  };

  // 模拟 EEG 情绪变化
  useEffect(() => {
    const emotions = ["Happy", "Calm", "Sad", "Angry"];
    const interval = setInterval(() => {
      const next = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(next);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">🧠 EEG User View</h1>

      <div className="text-center mb-6">
        <p className="font-medium text-gray-700">Current Emotional State:</p>
        <p
          className={`text-3xl font-semibold ${
            emotion === "Happy"
              ? "text-pink-500"
              : emotion === "Calm"
              ? "text-green-500"
              : emotion === "Sad"
              ? "text-blue-500"
              : "text-red-500"
          }`}
        >
          {emotion}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4 h-80 overflow-y-auto">
        {conversation.map((msg, i) => (
          <p
            key={i}
            className={`mb-2 ${
              msg.sender === "EEG User"
                ? "text-blue-600 text-right"
                : "text-gray-800 text-left"
            }`}
          >
            <strong>{msg.sender}: </strong>
            {msg.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
