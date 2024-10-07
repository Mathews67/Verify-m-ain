import React, { useState, useEffect } from 'react';
import CertificateGenerator from './CertificateGenerator';
import TranscriptGenerator from './TranscriptGenerator';
import RegisterSchool from './RegisterSchool';
import ManagePayments from './ManagePayments';
import './Dashboard.css';
import { verify_backend } from 'declarations/verify_backend';
import { PieChart, Pie, Cell, Tooltip } from 'recharts'; // Removed Legend
import { FaRobot } from 'react-icons/fa'; // Import AI icon
import axios from 'axios'; // Import axios for API requests

// Chatboard for user interaction
const predefinedResponses = {
  'How do I generate a certificate?': 'To generate a certificate, go to the Certificates section in the dashboard and click on "Generate Certificate".',
  'How do I generate a transcript?': 'To generate a transcript, visit the Transcripts section and click on "Generate Transcript".',
  'Where can I register a new school?': 'To register a new school, please visit the "Register School" section in the dashboard.',
  'hello': 'Hello! How can I assist you today?',
  'hi': 'Hi there! How can I help you?',
  'help': 'You can ask questions about generating certificates, transcripts, or managing school-related tasks.',
  'Where can I manage payments?': 'You can manage payments by visiting the "Manage Payments" section in the dashboard.',
  'Where can I view top students?': 'Top students can be viewed in the analytics section of the dashboard.',
};

const Chatboard = ({ fetchAIResponse }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = newMessage.trim();
      setMessages([...messages, { id: messages.length + 1, text: userMessage, sender: 'User' }]);

      // Generate bot response based on predefined questions
      const response = predefinedResponses[userMessage.toLowerCase()] || "I'm sorry, I don't understand that question.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: response, sender: 'Bot' },
      ]);

      // Call AI function to get additional insights
      const aiResponse = await fetchAIResponse(userMessage);
      if (aiResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: aiResponse, sender: 'AI' },
        ]);
      }
      setNewMessage(''); // Reset message input
    }
  };

  return (
    <div className="chatboard">
      <h3>Artificial Intelligence</h3>
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.sender}`}>
            <strong>{message.sender}: </strong>{message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="chat-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [totalTranscripts, setTotalTranscripts] = useState(0);
  const [totalFinancials, setTotalFinancials] = useState(0);
  const [totalSchools, setTotalSchools] = useState(0);
  const [topStudents, setTopStudents] = useState([]);
  const [showRegisterSchool, setShowRegisterSchool] = useState(false);
  const [showManagePayments, setShowManagePayments] = useState(false);

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const allDocuments = await verify_backend.getAllDocuments();
      const certificates = allDocuments.filter(([_, doc]) => 'Certificate' in doc).length;
      const transcripts = allDocuments.filter(([_, doc]) => 'Transcript' in doc).length;
      const financials = allDocuments.filter(([_, doc]) => 'Payment' in doc).length;
      const schools = allDocuments.filter(([_, doc]) => 'School' in doc).length;

      setTotalCertificates(certificates);
      setTotalTranscripts(transcripts);
      setTotalFinancials(financials);
      setTotalSchools(schools);

      const studentNames = allDocuments
        .filter(([_, doc]) => 'Transcript' in doc)
        .map(([_, doc]) => doc.studentName);
      const uniqueNames = Array.from(new Set(studentNames));
      setTopStudents(uniqueNames.slice(0, 5));
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  const fetchAIResponse = async (userMessage) => {
    try {
      // Replace 'your-ai-endpoint' with your actual AI service endpoint
      const response = await axios.post('your-ai-endpoint', { message: userMessage });
      return response.data.reply; // Assuming the AI response has a 'reply' field
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "I couldn't fetch a response from the AI service.";
    }
  };

  const handleGenerate = (e, type) => {
    e.preventDefault();
    setFormType(type);
    setShowForm(true);
    setShowRegisterSchool(false);
    setShowManagePayments(false);
  };

  const handleShowRegisterSchool = (e) => {
    e.preventDefault();
    setShowRegisterSchool(true);
    setShowForm(false);
    setShowManagePayments(false);
  };

  const handleShowManagePayments = (e) => {
    e.preventDefault();
    setShowManagePayments(true);
    setShowForm(false);
    setShowRegisterSchool(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setShowRegisterSchool(false);
    setShowManagePayments(false);
    setFormType('');
  };

  const pieData = [
    { name: 'Certificates', value: totalCertificates },
    { name: 'Transcripts', value: totalTranscripts },
    { name: 'Financials', value: totalFinancials },
    { name: 'Registered Institutions', value: totalSchools },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h1>Admin Dashboard</h1>
        <a href="#" onClick={(e) => handleGenerate(e, 'certificate')}>Generate Certificate</a>
        <a href="#" onClick={(e) => handleGenerate(e, 'transcript')}>Generate Transcripts</a>
        <a href="#" onClick={handleShowRegisterSchool}>Register School</a>
        <a href="#" onClick={handleShowManagePayments}>Manage Payments</a>
        <div className="logout">
          <button>Log Out</button>
        </div>
      </div>
      <div className="main-content">
        <h2>Admin Dashboard</h2>
        <div className="content-body">
          {!showForm && !showRegisterSchool && !showManagePayments && (
            <div className="cards">
              <div className="card">
                <h3>Certificates</h3>
                <p>{totalCertificates}</p>
              </div>
              <div className="card">
                <h3>Transcripts</h3>
                <p>{totalTranscripts}</p>
              </div>
              <div className="card">
                <h3>Financials</h3>
                <p>{totalFinancials}</p>
              </div>
              <div className="card">
                <h3>Registered Institutions</h3>
                <p>{totalSchools}</p>
              </div>
            </div>
          )}

          {!showForm && !showRegisterSchool && !showManagePayments && (
            <div className="cards">
              {/* Updated Pie Chart Card */}
              <div className="card chart-card">
                <h3>Analytics</h3>
                <PieChart width={160} height={160}>
                  <Pie data={pieData} cx={80} cy={80} outerRadius={60} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip /> {/* Tooltip on hover */}
                </PieChart>
              </div>

              {/* AI Analytics Card */}
              <div className="card ai-card">
                <h3>AI Analytics and Predictions</h3>
                <FaRobot size={50} /> {/* AI Icon */}
              </div>
            </div>
          )}

          <div className="form-container">
            {showForm && formType === 'certificate' && <CertificateGenerator onClose={handleCloseForm} />}
            {showForm && formType === 'transcript' && <TranscriptGenerator onClose={handleCloseForm} />}
            {showRegisterSchool && <RegisterSchool onClose={handleCloseForm} />}
            {showManagePayments && <ManagePayments onClose={handleCloseForm} />}
          </div>
        </div>
      </div>

      {/* AI Chatboard */}
      <Chatboard fetchAIResponse={fetchAIResponse} />
    </div>
  );
};

export default Dashboard;
