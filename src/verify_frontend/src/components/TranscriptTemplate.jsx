import React from 'react';
import QRCode from 'react-qr-code';
import './TranscriptTemplate.css'; // Import the CSS file

const TranscriptTemplate = ({ studentName, programName, yearOfCompletion, courses, qrCodeValue }) => {
  return (
    <div className="transcript-template">
      <h2>Transcript of Records</h2>
      <div className="transcript-details">
        <p><strong>Student Name:</strong> {studentName}</p>
        <p><strong>Program:</strong> {programName}</p>
        <p><strong>Year of Completion:</strong> {yearOfCompletion}</p>
        <h3>Courses:</h3>
        <ul>
          {courses.map((course, index) => (
            <li key={index}>{course}</li>
          ))}
        </ul>
      </div>
      <div className="qr-code">
        <h4>QR Code:</h4>
        <QRCode value={qrCodeValue} size={128} />
      </div>
    </div>
  );
};

export default TranscriptTemplate;
