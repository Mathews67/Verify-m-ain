import React, { useState } from 'react';
import { verify_backend } from 'declarations/verify_backend';
import QRCode from 'react-qr-code';
import CertificateTemplate from './CertificateTemplate'; // Import CertificateTemplate
import './TranscriptGenerator.css';  // Importing the custom CSS
import jsPDF from 'jspdf';
import './styles.css'; // Import your new CSS file

const CertificateGenerator = ({ fetchTotals }) => {
  const [formData, setFormData] = useState({
    student_id: '001', // Default selection
    name: 'John Doe', // Default selection
    program: 'Computer Science', // Default program
    year_of_completion: '2024' // Default year
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

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
      const result = await verify_backend.createCertificate(
        formData.student_id,
        formData.name,
        formData.program,
        formData.year_of_completion
      );
      setGeneratedCode(result);
      setQrCodeValue(result);
      fetchTotals(); // Update totals after generation
      setSuccessMessage('Certificate generated successfully!'); // Set success message
      setTimeout(() => {
        setSuccessMessage(''); // Clear the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Certificate Code: ${generatedCode}`, 10, 10);
    doc.text(`Name: ${formData.name}`, 10, 20);
    doc.text(`Program: ${formData.program}`, 10, 30);
    doc.text(`Year of Completion: ${formData.year_of_completion}`, 10, 40);

    // Create QR code image dynamically for PDF
    const qrCodeCanvas = document.querySelector("#qrcode > canvas");
    const qrImage = qrCodeCanvas.toDataURL("image/png");

    doc.addImage(qrImage, 'PNG', 10, 50, 50, 50);

    // Open PDF in new tab
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
  };

  const handleViewCertificate = () => {
    setShowCertificate(true);
  };

  return (
    <div className="container">
      <h2>Generate Certificate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="student_id">Student ID:</label>
          <select name="student_id" value={formData.student_id} onChange={handleChange} required>
            <option value="001">001</option>
            <option value="002">002</option>
            <option value="003">003</option>
            <option value="004">004</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <select name="name" value={formData.name} onChange={handleChange} required>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
            <option value="Alice Johnson">Alice Johnson</option>
            <option value="Bob Brown">Bob Brown</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="program">Program:</label>
          <select name="program" value={formData.program} onChange={handleChange} required>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Engineering">Engineering</option>
            <option value="Business Administration">Business Administration</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year_of_completion">Year of Completion:</label>
          <select name="year_of_completion" value={formData.year_of_completion} onChange={handleChange} required>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>

      {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success message */}

      {generatedCode && (
        <div className="qr-code-container">
          <button className="view" onClick={handleViewCertificate}>View Certificate</button>
          <button className="download" onClick={handleDownloadPDF}>Download PDF</button>

          {showCertificate && (
            <div id="certificate">
              <h3>Generated Certificate Code: {generatedCode}</h3>
              <CertificateTemplate
                studentName={formData.name}
                courseName={formData.program}
                issueDate={formData.year_of_completion}
                qrCodeValue={qrCodeValue} // Passing the QR code value to the template
                generatedCode={generatedCode}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;
