// CertificateTemplate.jsx
import React from 'react';
import QRCode from 'react-qr-code'; // Import QR code generator
import './CertificateTemplate.css'; // Add any necessary styles

const CertificateTemplate = ({ studentName, courseName, issueDate, qrCodeValue,generatedCode }) => {
  return (
    <div className="certificate-container">
      <h1>Certificate of Completion</h1>
      <p>This is to certify that</p>
      <h2>{studentName}</h2>
      <p>has successfully completed the course</p>
      <h3>{courseName}</h3>
      <p>Issued : {issueDate}</p>
      <p>cert={generatedCode}</p>
      <p>Signature: Prof Tembo Mathews</p>

      {/* QR Code Display */}
      {qrCodeValue && (
        <div className="qr-code">
          <QRCode value={qrCodeValue} size={100} />
        </div>
      )}
    </div>
  );
};

export default CertificateTemplate;
