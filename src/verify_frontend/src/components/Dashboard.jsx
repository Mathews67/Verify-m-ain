import React, { useState, useEffect } from 'react';
import { verify_backend } from 'declarations/verify_backend';
import './Dashboard.css';

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
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [totalTranscripts, setTotalTranscripts] = useState(0);

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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
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
        console.log('Generated Certificate Code:', result);
      } else if (formType === 'transcript') {
        const courses = formData.courses.split(',').map(course => course.trim());
        const result = await verify_backend.createTranscript(
          formData.student_id,
          formData.name,
          formData.program,
          formData.year_of_completion,
          courses
        );
        console.log('Generated Transcript Code:', result);
      }
      fetchTotals(); // Update totals after generation
      handleCloseForm();
    } catch (error) {
      console.error("Error generating document:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h1>Dashboard</h1>
        <a href="#" onClick={(e) => handleGenerate(e, 'certificate')}>Generate Certificate</a>
        <a href="#" onClick={(e) => handleGenerate(e, 'transcript')}>Generate Transcripts</a>
        <a href="#" onClick={(e) => handleGenerate(e, 'certificate')}>View Certificate</a>
        <a href="#" onClick={(e) => handleGenerate(e, 'transcript')}>View Transcripts</a>
        <a href="#" onClick={(e) => handleGenerate(e, 'transcript')}>settings</a>
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
                  Courses (comma separated):
                  <input type="text" name="courses" value={formData.courses} onChange={handleChange} />
                </label>
              )}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;