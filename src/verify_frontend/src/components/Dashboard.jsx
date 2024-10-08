import React, { useState, useEffect } from 'react';
import CertificateGenerator from './CertificateGenerator';
import TranscriptGenerator from './TranscriptGenerator';
import RegisterSchool from './RegisterSchool';
import ManagePayments from './ManagePayments';
import './Dashboard.css';
import { verify_backend } from 'declarations/verify_backend';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { FaRobot } from 'react-icons/fa'; 
import axios from 'axios'; 


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

  const handleDownload = (url, fileName) => {
    // Opens the file in a new tab
    const newTab = window.open(url, '_blank');
    if (newTab) {
      newTab.focus();
    }
    // Initiates download if needed
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
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
        <h1>Dashboard</h1>
        <a href="#" onClick={(e) => handleGenerate(e, 'certificate')}>Generate Certificate</a>
        <a href="#" onClick={(e) => handleGenerate(e, 'transcript')}>Generate Transcripts</a>
        <a href="#" onClick={handleShowRegisterSchool}>Register School</a>
        <a href="#" onClick={handleShowManagePayments}>Manage Payments</a>
    
        <a href="/">
          <button>Log Out</button>
        </a>
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
              <div className="card chart-card">
                <h3>Analytics</h3>
                <PieChart width={160} height={160}>
                  <Pie data={pieData} cx={80} cy={80} outerRadius={60} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          )}

          <div className="form-container">
            {showForm && formType === 'certificate' && (
              <CertificateGenerator 
                onClose={handleCloseForm} 
                onDownload={(url) => handleDownload(url, 'certificate.pdf')}
              />
            )}
            {showForm && formType === 'transcript' && (
              <TranscriptGenerator 
                onClose={handleCloseForm} 
                onDownload={(url) => handleDownload(url, 'transcript.pdf')}
              />
            )}
            {showRegisterSchool && <RegisterSchool onClose={handleCloseForm} />}
            {showManagePayments && <ManagePayments onClose={handleCloseForm} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
