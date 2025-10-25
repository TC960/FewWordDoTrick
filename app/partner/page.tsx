"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, push } from "firebase/database";

export default function PartnerPage() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<any[]>([]);
  const [userEmotion, setUserEmotion] = useState("Neutral");

  // 监听 EEG 用户的消息和情绪
  useEffect(() => {
    const convoRef = ref(db, "conversation");
    const unsubscribe = onValue(convoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const convoArray = Object.values(data);
        setConversation(convoArray);
        const lastEEG = convoArray.reverse().find((msg: any) => msg.sender === "EEG User");
        if (lastEEG) setUserEmotion(lastEEG.emotion);
      }
    });
    return () => unsubscribe();
  }, []);

  // 发送 Partner 消息
  const handleSend = async () => {
    if (!message.trim()) return;
    const convoRef = ref(db, "conversation");
    await push(convoRef, {
      sender: "Partner",
      text: message,
      timestamp: Date.now(),
    });
    setMessage("");
  };

  return (
    <div
      className={`p-6 max-w-xl mx-auto min-h-screen transition-colors duration-500 ${
        userEmotion === "Happy"
          ? "bg-pink-50"
          : userEmotion === "Calm"
          ? "bg-green-50"
          : userEmotion === "Sad"
          ? "bg-blue-50"
          : userEmotion === "Angry"
          ? "bg-red-50"
          : "bg-gray-50"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">🤝 Partner View</h1>

      <div className="text-center mb-4">
        <p className="font-medium text-gray-700">EEG User’s Emotion:</p>
        <p
          className={`text-3xl font-semibold ${
            userEmotion === "Happy"
              ? "text-pink-500"
              : userEmotion === "Calm"
              ? "text-green-500"
              : userEmotion === "Sad"
              ? "text-blue-500"
              : "text-red-500"
          }`}
        >
          {userEmotion}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4 h-80 overflow-y-auto">
        {conversation.map((msg, i) => (
          <p
            key={i}
            className={`mb-2 ${
              msg.sender === "Partner"
                ? "text-green-700 text-right"
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
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
