import React, { useState } from 'react';
import { verify_backend } from 'declarations/verify_backend';
import QRCode from 'react-qr-code';
import Select from 'react-select'; // Importing react-select for multi-selection
import TranscriptTemplate from './TranscriptTemplate'; // Import TranscriptTemplate
import './TranscriptGenerator.css'; // Importing the custom CSS
import jsPDF from 'jspdf';
import './styles.css'; // Import your new CSS file

const TranscriptGenerator = ({ fetchTotals }) => {
  const [formData, setFormData] = useState({
    student_id: '001', // Default selection
    name: 'John Doe', // Default selection
    program: 'Computer Science', // Default program
    year_of_completion: '2024', // Default year
    courses: [], // Store selected courses as an array
  });
  
  const [generatedCode, setGeneratedCode] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const studentOptions = [
    { value: '001', label: 'John Doe' },
    { value: '002', label: 'Jane Smith' },
    { value: '003', label: 'Alice Johnson' },
    { value: '004', label: 'Bob Brown' },
    // Add more students as needed
  ];

  const programOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Business Administration', label: 'Business Administration' },
    // Add more programs as needed
  ];

  const courseOptions = [
    { value: 'Database Management System', label: 'Database Management System' },
    { value: 'Information Security', label: 'Information Security' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Project Management', label: 'Project Management' },
    { value: 'Digital Forensics', label: 'Digital Forensics' },
    // Add more courses as needed
  ];

  const yearOfCompletionOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCourseChange = (selectedOptions) => {
    setFormData(prevState => ({
      ...prevState,
      courses: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await verify_backend.createTranscript(
        formData.student_id,
        formData.name,
        formData.program,
        formData.year_of_completion,
        formData.courses // Pass the selected courses array directly
      );
      setGeneratedCode(result);
      setQrCodeValue(result); // Set QR code value for Certificate Template
      fetchTotals(); // Update totals after generation
      setSuccessMessage('Transcript generated successfully!'); // Set success message
      setTimeout(() => {
        setSuccessMessage(''); // Clear the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error generating transcript:", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Transcript Code: ${generatedCode}`, 10, 10);
    doc.text(`Name: ${formData.name}`, 10, 20);
    doc.text(`Program: ${formData.program}`, 10, 30);
    doc.text(`Year of Completion: ${formData.year_of_completion}`, 10, 40);
    doc.text(`Courses: ${formData.courses.join(', ')}`, 10, 50); // Display selected courses

    // Create QR code image dynamically for PDF
    const qrCodeCanvas = document.querySelector("#qrcode > canvas");
    const qrImage = qrCodeCanvas.toDataURL("image/png");

    doc.addImage(qrImage, 'PNG', 10, 60, 50, 50);

    // Open PDF in new tab
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="container">
      <h2>Generate Transcript</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="student_id">Student ID:</label>
          <select name="student_id" value={formData.student_id} onChange={handleChange} required>
            {studentOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <select name="name" value={formData.name} onChange={handleChange} required>
            {studentOptions.map(option => (
              <option key={option.value} value={option.label}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="program">Program:</label>
          <select name="program" value={formData.program} onChange={handleChange} required>
            {programOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year_of_completion">Year of Completion:</label>
          <select name="year_of_completion" value={formData.year_of_completion} onChange={handleChange} required>
            {yearOfCompletionOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="courses">Courses (select multiple):</label>
          <Select
            options={courseOptions}
            isMulti
            onChange={handleCourseChange} // Handle multiple course selection
            placeholder="Select courses"
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success message */}

      {generatedCode && (
        <div className="qr-code-container">
          <button className="download" onClick={handleDownloadPDF}>Download PDF</button>

          {/* Display the transcript template */}
          <TranscriptTemplate
            studentName={formData.name}
            programName={formData.program}
            yearOfCompletion={formData.year_of_completion}
            courses={formData.courses} // Pass selected courses
            qrCodeValue={qrCodeValue} // Passing the QR code value to the template
          />
        </div>
      )}
    </div>
  );
};

export default TranscriptGenerator;
