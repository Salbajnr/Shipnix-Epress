import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MessageCircle, Send, X, User, Bot, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
// Using an SVG logo inline to avoid asset loading issues
const shipnixLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzI1NjNFQiIvPgo8cGF0aCBkPSJNMTIgMTJIMjhWMTZIMTJWMTJaTTEyIDIwSDI0VjI0SDEyVjIwWk0xMiAyOEgyOFYzMkgxMlYyOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  senderName?: string;
  senderAvatar?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface SupportAgent {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy';
  department: string;
}

export default function LiveChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<SupportAgent | null>(null);
  const [chatSession, setChatSession] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample support agents
  const supportAgents: SupportAgent[] = [
    {
      id: "agent-1",
      name: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
      status: "online",
      department: "Customer Support"
    },
    {
      id: "agent-2", 
      name: "Mike Rodriguez",
      avatar: "/api/placeholder/40/40",
      status: "online",
      department: "Technical Support"
    },
    {
      id: "agent-3",
      name: "Emma Wilson",
      avatar: "/api/placeholder/40/40", 
      status: "away",
      department: "Billing Support"
    }
  ];

  const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'chat_message') {
        const newMessage: ChatMessage = {
          id: data.messageId,
          content: data.content,
          sender: data.sender,
          timestamp: new Date(data.timestamp),
          senderName: data.senderName,
          senderAvatar: data.senderAvatar
        };
        setMessages(prev => [...prev, newMessage]);
        
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }
      
      if (data.type === 'agent_typing') {
        setIsTyping(data.isTyping);
      }
      
      if (data.type === 'agent_assigned') {
        const agent = supportAgents.find(a => a.id === data.agentId);
        setCurrentAgent(agent || null);
      }
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Hello${user ? ` ${user.firstName}` : ''}! 👋 Welcome to Shipnix-Express support. How can we help you today?`,
        sender: 'bot',
        timestamp: new Date(),
        senderName: 'Support Bot'
      };
      setMessages([welcomeMessage]);
      
      // Simulate agent assignment after a brief delay
      setTimeout(() => {
        const availableAgent = supportAgents.find(agent => agent.status === 'online');
        if (availableAgent) {
          setCurrentAgent(availableAgent);
          const agentMessage: ChatMessage = {
            id: 'agent-intro',
            content: `Hi! I'm ${availableAgent.name} from ${availableAgent.department}. I'll be assisting you today. What can I help you with?`,
            sender: 'agent',
            timestamp: new Date(),
            senderName: availableAgent.name,
            senderAvatar: availableAgent.avatar
          };
          setMessages(prev => [...prev, agentMessage]);
        }
      }, 2000);
    }
  }, [isOpen, user]);

  // Clear unread count when chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user',
      timestamp: new Date(),
      senderName: user?.firstName + ' ' + user?.lastName || 'Guest',
      senderAvatar: user?.profileImageUrl,
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    // Send via WebSocket if connected
    if (isConnected && chatSession) {
      sendWebSocketMessage({
        type: 'chat_message',
        sessionId: chatSession,
        content: userMessage.content,
        sender: 'user'
      });
    }
    
    // Simulate agent response
    setTimeout(() => {
      // Update message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        // Generate contextual response
        const responses = [
          "I understand your concern. Let me look into this for you right away.",
          "Thank you for reaching out. I'll help you resolve this issue.",
          "I see what you mean. Let me check our system and get back to you with a solution.",
          "That's a great question! I'll provide you with the information you need.",
          "I apologize for any inconvenience. Let me investigate this matter for you."
        ];
        
        const agentResponse: ChatMessage = {
          id: Date.now().toString() + '-agent',
          content: responses[Math.floor(Math.random() * responses.length)],
          sender: 'agent',
          timestamp: new Date(),
          senderName: currentAgent?.name || 'Support Agent',
          senderAvatar: currentAgent?.avatar
        };
        
        setMessages(prev => [...prev, agentResponse]);
      }, 1500);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!chatSession) {
      setChatSession(Date.now().toString());
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <CheckCircle className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case 'read':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={openChat}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Chat Window */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md h-[600px] p-0 gap-0 fixed bottom-6 right-6 top-auto left-auto transform-none">
          <Card className="h-full flex flex-col border-0 shadow-2xl">
            {/* Chat Header */}
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={shipnixLogo} alt="Shipnix" className="h-8 w-8" />
                  <div>
                    <CardTitle className="text-sm">Live Support</CardTitle>
                    <div className="flex items-center space-x-2 text-xs opacity-90">
                      {currentAgent ? (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>{currentAgent.name} - {currentAgent.department}</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span>Connecting to agent...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    -
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                {/* Chat Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="h-8 w-8 shrink-0">
                          {msg.sender === 'user' ? (
                            <>
                              <AvatarImage src={msg.senderAvatar} />
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </>
                          ) : msg.sender === 'bot' ? (
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          ) : (
                            <>
                              <AvatarImage src={msg.senderAvatar} />
                              <AvatarFallback>{msg.senderName?.charAt(0)}</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        
                        <div className={`${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                          <div
                            className={`inline-block px-3 py-2 rounded-lg text-sm ${
                              msg.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : msg.sender === 'bot'
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {msg.sender === 'user' && getStatusIcon(msg.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={currentAgent?.avatar} />
                          <AvatarFallback>{currentAgent?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  {!isAuthenticated && (
                    <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        <a href="/api/login" className="underline">Sign in</a> for personalized support
                      </p>
                    </div>
                  )}
                  
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
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Typically replies in a few minutes
                  </p>
                </div>
              </>
            )}
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}