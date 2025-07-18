import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone, 
  Mail, 
  Clock,
  User,
  Bot,
  Minimize2,
  Maximize2
} from "lucide-react";

interface ChatMessage {
  id: number;
  message: string;
  sender: "user" | "admin" | "bot";
  timestamp: Date;
  senderName?: string;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [adminOnline, setAdminOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      message: "Hi! I'm Sarah from Shipnix support. How can I help you today?",
      sender: "admin",
      timestamp: new Date(),
      senderName: "Sarah (Support)"
    },
    {
      id: 2,
      message: "Welcome! You can ask me about tracking, shipping rates, or any other questions.",
      sender: "bot",
      timestamp: new Date(),
      senderName: "Assistant"
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      message: message.trim(),
      sender: "user",
      timestamp: new Date(),
      senderName: "You"
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate admin response
    setTimeout(() => {
      setIsTyping(false);
      const response: ChatMessage = {
        id: Date.now() + 1,
        message: "Thanks for your message! I'll look into that for you right away. Can you provide your tracking ID?",
        sender: "admin",
        timestamp: new Date(),
        senderName: "Sarah (Support)"
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case "admin":
        return <User className="h-4 w-4" />;
      case "bot":
        return <Bot className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case "admin":
        return "bg-blue-500 text-white";
      case "bot":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full btn-gradient shadow-xl-colored relative"
        >
          <MessageCircle className="h-6 w-6" />
          {adminOnline && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 shadow-xl-colored transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              {adminOnline && (
                <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border border-white"></span>
              )}
            </div>
            <div>
              <CardTitle className="text-sm font-medium">Live Support</CardTitle>
              <div className="flex items-center space-x-1 text-xs">
                <Clock className="h-3 w-3" />
                <span>{adminOnline ? "Online now" : "We'll respond soon"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : msg.sender === "admin"
                        ? "bg-white dark:bg-gray-800 border shadow-sm"
                        : "bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800"
                    }`}
                  >
                    {msg.sender !== "user" && (
                      <div className="flex items-center space-x-1 mb-1">
                        <div className={`h-4 w-4 rounded-full flex items-center justify-center ${getSenderColor(msg.sender)}`}>
                          {getSenderIcon(msg.sender)}
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {msg.senderName}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border shadow-sm rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center ${getSenderColor("admin")}`}>
                        <User className="h-3 w-3" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Sarah is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white dark:bg-gray-800">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="icon"
                  className="btn-gradient"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                  onClick={() => setMessage("I need help with tracking")}
                >
                  Track package
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                  onClick={() => setMessage("What are your shipping rates?")}
                >
                  Shipping rates
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                  onClick={() => setMessage("I have a billing question")}
                >
                  Billing
                </Badge>
              </div>

              {/* Contact Options */}
              <div className="flex justify-center space-x-4 mt-3 pt-2 border-t">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  Call Us
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}