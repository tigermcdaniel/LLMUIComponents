import { useState, useRef, useEffect } from "react";
import "./App.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, newMessage] }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
      <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-xl mx-auto my-2 p-3 rounded-lg whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-green-100 text-right self-end ml-auto"
                    : "bg-white text-left self-start mr-auto border"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
          </main>
          <footer>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring"
                placeholder="Send a message..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
              >
                Send
              </button>
          </footer>
    </div>
  );
}

export default App;
