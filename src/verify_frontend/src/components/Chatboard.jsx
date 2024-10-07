import React, { useState, useEffect } from 'react';
import './Chatboard.css'; // Custom styles for the chatboard

const Chatboard = ({ predefinedResponses }) => {
  const [message, setMessage] = useState(''); // Current message to be sent
  const [chatHistory, setChatHistory] = useState([]); // Chat history

  // Function to handle sending messages and triggering bot responses
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const userMessage = message.trim();
      // Add user's message to the chat history
      setChatHistory((prev) => [...prev, { sender: 'User', content: userMessage }]);
      handleBotResponse(userMessage); // Trigger bot response based on user's message
      setMessage(''); // Clear input after sending
    }
  };

  // Function to handle bot responses based on user input
  const handleBotResponse = (userMessage) => {
    const normalizedMessage = userMessage.toLowerCase(); // Normalize user input for case-insensitive matching
    const response = predefinedResponses[normalizedMessage] || "I'm sorry, I don't understand that question. Please ask something else.";

    // Simulate a delay for the bot's response
    setTimeout(() => {
      setChatHistory((prev) => [...prev, { sender: 'Bot', content: response }]);
    }, 1000); 
  };

  return (
    <div className="chatboard-container">
      {/* Chat History Display */}
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'User' ? 'user-message' : 'bot-message'}`}>
            <strong>{msg.sender}: </strong>{msg.content}
          </div>
        ))}
      </div>

      {/* Input form for new messages */}
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Chatboard;
