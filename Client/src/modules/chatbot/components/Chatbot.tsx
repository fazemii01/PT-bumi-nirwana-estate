import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = io('http://localhost:3001'); // Assuming the backend runs on port 3001

    // Listen for incoming messages
    socketRef.current.on('message', (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: 'bot' },
      ]);
    });

    // Disconnect on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && socketRef.current) {
      const userMessage: Message = { text: inputValue, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      socketRef.current.emit('message', inputValue);
      setInputValue('');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      <button
        onClick={toggleChat}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        {isOpen ? 'X' : '💬'}
      </button>
      {isOpen && (
        <div
          style={{
            width: '350px',
            height: '500px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '10px',
          }}
        >
          <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    backgroundColor:
                      msg.sender === 'user' ? '#007bff' : '#e9e9eb',
                    color: msg.sender === 'user' ? 'white' : 'black',
                    padding: '10px',
                    borderRadius: '10px',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', padding: '10px' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                marginLeft: '10px',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;