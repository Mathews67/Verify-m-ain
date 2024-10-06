// CertificateGenerator.jsx
import React, { useState } from 'react';
import { verify_backend } from 'declarations/verify_backend';
import QRCode from 'react-qr-code';
import jsPDF from 'jspdf';

const CertificateGenerator = ({ fetchTotals }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    program: '',
    year_of_completion: ''
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');

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
    doc.addImage(document.getElementById('qrcode').toDataURL(), 'PNG', 10, 50, 50, 50);
    doc.save('certificate.pdf');
  };

  return (
    <div>
      <h2>Generate Certificate</h2>
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
        <button type="submit">Submit</button>
      </form>

      {generatedCode && (
        <div>
          <h3>Generated Certificate Code: {generatedCode}</h3>
          <div id="qrcode">
            <QRCode value={qrCodeValue} />
          </div>
          <button onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;
