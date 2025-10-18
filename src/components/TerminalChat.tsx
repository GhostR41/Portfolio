import { useState, useRef, useEffect } from "react";
import { Terminal } from "lucide-react";

interface Message {
  text: string;
  type: "command" | "response";
}

export function TerminalChat() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "ENCRYPTED COMMUNICATION CHANNEL ACTIVE", type: "response" },
    { text: "Type 'help' for available commands", type: "response" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = input.trim();
    setMessages((prev) => [...prev, { text: `> ${command}`, type: "command" }]);

    // Simulate command responses
    setTimeout(() => {
      let response = "";
      switch (command.toLowerCase()) {
        case "help":
          response = "Available commands: about, projects, skills, contact, secret, clear";
          break;
        case "about":
          response = "Heker";
          break;
        case "projects":
          response = "4 major projects deployed. View /projects for details.";
          break;
        case "skills":
          response = "Frontend: React, TypeScript | Backend: Node.js, PostgreSQL | Cloud: AWS";
          break;
        case "contact":
          response = "Email: agent@tactical-ops.com | GitHub: @yourusername";
          break;
        case "secret":
          response = "ACCESS GRANTED: Passionate about building elegant solutions to complex problems.";
          break;
        case "clear":
          setMessages([]);
          return;
        default:
          response = `Command not recognized: ${command}. Type 'help' for available commands.`;
      }
      setMessages((prev) => [...prev, { text: response, type: "response" }]);
    }, 500);

    setInput("");
  };

  return (
    <div className="tactical-border rounded bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground">ENCRYPTED TERMINAL</h3>
      </div>
      <div className="bg-terminal-bg rounded p-4 h-80 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-xs font-mono ${
                msg.type === "command" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <span className="text-primary text-sm">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none terminal-cursor"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
