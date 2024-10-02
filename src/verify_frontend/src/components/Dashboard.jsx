import React, { useState, useEffect } from 'react';
import { verify_backend } from 'declarations/verify_backend';
import './Dashboard.css';
import QRCode from 'react-qr-code';
import jsPDF from 'jspdf';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    program: '',
    year_of_completion: '',
    courses: ''
  });
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [totalTranscripts, setTotalTranscripts] = useState(0);

  const courseOptions = [
    { name: "English Language" },
    { name: "Mathematics" },
    { name: "Science" },
    { name: "Chemistry" },
    { name: "Physics" },
    { name: "Biology" }
  ];

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
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  const handleGenerate = (e, type) => {
    e.preventDefault();
    setFormType(type);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormType('');
    setFormData({
      student_id: '',
      name: '',
      program: '',
      year_of_completion: '',
      courses: ''
    });
    setGeneratedCode('');
    setQrCodeValue('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCourseChange = (e) => {
    const selectedCourses = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prevState => ({
      ...prevState,
      courses: selectedCourses.join(', ')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formType === 'certificate') {
        const result = await verify_backend.createCertificate(
          formData.student_id,
          formData.name,
          formData.program,
          formData.year_of_completion
        );
        setGeneratedCode(result);
        setQrCodeValue(result); // QR code will be generated from the document code
      } else if (formType === 'transcript') {
        const result = await verify_backend.createTranscript(
          formData.student_id,
          formData.name,
          formData.program,
          formData.year_of_completion,
          formData.courses.split(',').map(course => course.trim())
        );
        setGeneratedCode(result);
        setQrCodeValue(result);
      }
      fetchTotals(); // Update totals after generation
    } catch (error) {
      console.error("Error generating document:", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Document Code: ${generatedCode}`, 10, 10);
    doc.text(`Name: ${formData.name}`, 10, 20);
    doc.text(`Program: ${formData.program}`, 10, 30);
    doc.text(`Year of Completion: ${formData.year_of_completion}`, 10, 40);
    doc.text(`Courses: ${formData.courses}`, 10, 50);
    doc.addImage(document.getElementById('qrcode').toDataURL(), 'PNG', 10, 60, 50, 50);
    doc.save('document.pdf');
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h1>Dashboard</h1>
        <a href="#" onClick={(e) => handleGenerate(e, 'certificate')}>Generate Certificate</a>
        <a href="#" onClick={(e) => handleGenerate(e, 'transcript')}>Generate Transcripts</a>
        <div className="logout">
          <a href="#">Logout</a>
        </div>
      </div>

      <div className="main-content">
        <h2>Certificates & Transcripts Generations</h2>
        <div className="cards">
          <div className="card">
            <h3>Total Certificates Generated</h3>
            <p>{totalCertificates}</p>
          </div>
          <div className="card">
            <h3>Total Transcripts Generated</h3>
            <p>{totalTranscripts}</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleCloseForm}>&times;</span>
            <h2>{formType === 'certificate' ? 'Generate Certificate' : 'Generate Transcript'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Student ID:
                <input type="text" name="student_id" value={formData.student_id} onChange={handleChange} required />
              </label>
              <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label>
                Program:
                <input type="text" name="program" value={formData.program} onChange={handleChange} required />
              </label>
              <label>
                Year of Completion:
                <input type="text" name="year_of_completion" value={formData.year_of_completion} onChange={handleChange} required />
              </label>
              {formType === 'transcript' && (
                <label>
                  Courses:
                  <select multiple={true} onChange={handleCourseChange}>
                    {courseOptions.map((course, index) => (
                      <option key={index} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <button type="submit">Submit</button>
            </form>

            {generatedCode && (
              <div>
                <h3>Generated {formType === 'certificate' ? 'Certificate' : 'Transcript'} Code: {generatedCode}</h3>
                <div id="qrcode">
                  <QRCode value={qrCodeValue} />
                </div>
                <button onClick={handleDownloadPDF}>Download PDF</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
