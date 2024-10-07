import React, { useState, useEffect } from 'react';
import './Chatboard.css'; // You can add custom styles here for the chatboard

const Chatboard = () => {
  const [message, setMessage] = useState('');  // Current message to be sent
  const [chatHistory, setChatHistory] = useState([]); // Chat history

  // Predefined answers for common questions
  const predefinedResponses = {
    'How do I generate a certificate?': 'To generate a certificate, click on "Generate Certificate" in the sidebar, then fill in the required student details and submit the form.',
    'Where can I register a new school?': 'To register a new school, click on "Register School" in the sidebar. Fill in the necessary information, and submit the form to add the school.',
    'How do I view the total number of transcripts generated?': 'You can view the total number of transcripts by checking the "Transcripts" card in the main dashboard area. It shows the current count of all transcripts generated.',
    'Can I manage payments from this dashboard?': 'Yes, you can manage payments by clicking on "Manage Payments" in the sidebar. This will bring up the payment management interface where you can process payments.',
    'What is the purpose of the pie chart on the dashboard?': 'The pie chart provides a visual representation of the total number of certificates and transcripts generated in the system. You can easily see the distribution between the two.',
    'How do I log out of the system?': 'You can log out by clicking the "Log Out" button in the sidebar at any time. This will end your session and return you to the login screen.'
  };

  // Add a simple message to the chat history
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatHistory((prev) => [...prev, { sender: 'User', content: message }]);
      handleBotResponse(message);
      setMessage(''); // Clear input after sending
    }
  };

  // Function to handle bot responses based on user input
  const handleBotResponse = (userMessage) => {
    const response = predefinedResponses[userMessage] || "I'm sorry, I don't understand that question. Please ask something else.";
    setTimeout(() => {
      setChatHistory((prev) => [...prev, { sender: 'Bot', content: response }]);
    }, 1000); // Simulate a delay for the bot's response
  };

  return (
    <div className="chatboard-container">
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'User' ? 'user-message' : 'bot-message'}`}>
            <strong>{msg.sender}: </strong>{msg.content}
          </div>
        ))}
      </div>

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
