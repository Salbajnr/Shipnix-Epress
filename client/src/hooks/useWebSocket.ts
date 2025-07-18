import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messageHandlers = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    // Only attempt WebSocket connection in production or if explicitly enabled
    const shouldConnect = process.env.NODE_ENV === 'production' || process.env.VITE_ENABLE_WEBSOCKET === 'true';
    
    if (!shouldConnect) {
      console.log('WebSocket disabled in development mode');
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      };

      ws.onerror = (error) => {
        console.warn('WebSocket connection failed:', error);
        setIsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          const handler = messageHandlers.current.get(message.type);
          if (handler) {
            handler(message.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      return () => {
        ws.close();
      };
    } catch (error) {
      console.warn('Failed to create WebSocket connection:', error);
      setIsConnected(false);
    }
  }, []);

  const subscribe = (messageType: string, handler: (data: any) => void) => {
    messageHandlers.current.set(messageType, handler);
  };

  const unsubscribe = (messageType: string) => {
    messageHandlers.current.delete(messageType);
  };

  const sendMessage = (type: string, data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  };

  return {
    isConnected,
    lastMessage,
    subscribe,
    unsubscribe,
    sendMessage,
  };
}
