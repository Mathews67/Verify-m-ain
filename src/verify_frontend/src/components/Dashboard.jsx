import React, { useState, useEffect } from 'react';
import CertificateGenerator from './CertificateGenerator';
import TranscriptGenerator from './TranscriptGenerator';
import RegisterSchool from './RegisterSchool'; // Import the RegisterSchool component
import ManagePayments from './ManagePayments'; // Import the ManagePayments component
import './Dashboard.css';
import { verify_backend } from 'declarations/verify_backend';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; // Import necessary components from recharts

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [totalTranscripts, setTotalTranscripts] = useState(0);
  const [topStudents, setTopStudents] = useState([]);
  const [showRegisterSchool, setShowRegisterSchool] = useState(false); // State for showing the Register School form
  const [showManagePayments, setShowManagePayments] = useState(false); // State for showing Manage Payments form

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const allDocuments = await verify_backend.getAllDocuments();
      const certificates = allDocuments.filter(([_, doc]) => 'Certificate' in doc).length;
      const transcripts = allDocuments.filter(([_, doc]) => 'Transcript' in doc).length;

      setTotalCertificates(certificates);
      setTotalTranscripts(transcripts);

      // Fetch top five student names
      const studentNames = allDocuments
        .filter(([_, doc]) => 'Transcript' in doc)
        .map(([_, doc]) => doc.studentName); // Assuming each document has a studentName field
      const uniqueNames = Array.from(new Set(studentNames)); // Remove duplicates
      setTopStudents(uniqueNames.slice(0, 5)); // Get top 5 names
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  const handleGenerate = (e, type) => {
    e.preventDefault();
    setFormType(type);
    setShowForm(true);
    setShowRegisterSchool(false); // Ensure Register School form is closed
    setShowManagePayments(false); // Ensure Manage Payments form is closed
  };

  const handleShowRegisterSchool = (e) => {
    e.preventDefault();
    setShowRegisterSchool(true);
    setShowForm(false); // Ensure other forms are closed
    setShowManagePayments(false); // Ensure Manage Payments form is closed
  };

  const handleShowManagePayments = (e) => {
    e.preventDefault();
    setShowManagePayments(true);
    setShowForm(false); // Ensure other forms are closed
    setShowRegisterSchool(false); // Ensure Register School form is closed
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setShowRegisterSchool(false); // Reset Register School form visibility
    setShowManagePayments(false); // Reset Manage Payments form visibility
    setFormType('');
  };

  // Data for the pie charts
  const pieData = [
    { name: 'Certificates', value: totalCertificates },
    { name: 'Transcripts', value: totalTranscripts },
  ];

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h1>Dashboard</h1>
        <a href="#" onClick={(e) => handleGenerate(e, 'certificate')}>Generate Certificate</a>
        <a href="#" onClick={(e) => handleGenerate(e, 'transcript')}>Generate Transcripts</a>
        <a href="#" onClick={handleShowRegisterSchool}>Register School</a> {/* New link for RegisterSchool */}
        <a href="#" onClick={handleShowManagePayments}>Manage Payments</a> {/* New link for ManagePayments */}
        <div className="logout">
          <button>Log Out</button>
        </div>
      </div>
      <div className="main-content">
        <h2>Admin Dashboard</h2>
        <div className="cards">
          <div className="card">
            <h3> Certificates</h3>
            <p>{totalCertificates}</p>
          </div>
          <div className="card">
            <h3>Transcripts</h3>
            <p>{totalTranscripts}</p>
          </div>
        </div>
        
        {/* Pie Chart for Total Certificates and Transcripts */}
        <div className="cards">
          <div className="card">
            <h3>Documents Generated</h3>
            <PieChart width={400} height={300}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#0088FE' : '#FFBB28'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Manage Schools & Institutions Card with Registration Form */}
          <div className="card">
            <h3>Manage Schools & Institutions</h3>
            <RegisterSchool fetchTotals={fetchTotals} /> {/* Render the RegisterSchool component */}
          </div>
        </div>

        {showForm && (
          <div className="form-container">
            {formType === 'certificate' && <CertificateGenerator fetchTotals={fetchTotals} />}
            {formType === 'transcript' && <TranscriptGenerator fetchTotals={fetchTotals} />}
            <button className="close-btn" onClick={handleCloseForm}>Close</button>
          </div>
        )}

        {showRegisterSchool && (
          <div className="form-container">
            <RegisterSchool fetchTotals={fetchTotals} /> {/* Render the RegisterSchool component */}
            <button className="close-btn" onClick={handleCloseForm}>Close</button>
          </div>
        )}

        {showManagePayments && (
          <div className="form-container">
            <ManagePayments fetchTotals={fetchTotals} /> {/* Render the ManagePayments component */}
            <button className="close-btn" onClick={handleCloseForm}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
