// ManagePayments.jsx
import React, { useState } from 'react';
import './ManagePayments.css'; // Import CSS for styling

const ManagePayments = () => {
    const [schoolName, setSchoolName] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [copiesVerified, setCopiesVerified] = useState('');
    const [records, setRecords] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!schoolName || !paymentMode || !transactionDate || !copiesVerified) {
            alert('Please fill in all fields.');
            return;
        }

        const newRecord = {
            schoolName,
            paymentMode,
            transactionDate,
            copiesVerified,
        };

        setRecords([...records, newRecord]);
        // Reset form fields
        setSchoolName('');
        setPaymentMode('');
        setTransactionDate('');
        setCopiesVerified('');
    };

    return (
        <div className="form-container">
            <h2>Manage Payments</h2>
            <form onSubmit={handleSubmit}>
                <label className="label">School Name (ECZ or Registered School):</label>
                <input
                    type="text"
                    className="input-field"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                />

                <label className="label">Mode of Payment:</label>
                <select
                    className="input-field"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                >
                    <option value="">Select Payment Mode</option>
                    <option value="Bank">Bank</option>
                    <option value="Airtel">Airtel</option>
                    <option value="MTN">MTN</option>
                    <option value="Zamtel">Zamtel</option>
                    <option value="Zed Mobile">Zed Mobile Money</option>
                </select>

                <label className="label">Date of Transaction:</label>
                <input
                    type="date"
                    className="input-field"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                />

                <label className="label">Number of Copies Verified:</label>
                <input
                    type="number"
                    className="input-field"
                    value={copiesVerified}
                    onChange={(e) => setCopiesVerified(e.target.value)}
                />

                <button type="submit" className="button">Add Record</button>
            </form>

            <h3>Verification Records</h3>
            <table className="records-table">
                <thead>
                    <tr>
                        <th>School Name</th>
                        <th>Payment Mode</th>
                        <th>Date of Transaction</th>
                        <th>Copies Verified</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 ? (
                        <tr>
                            <td colSpan="4">No records found.</td>
                        </tr>
                    ) : (
                        records.map((record, index) => (
                            <tr key={index}>
                                <td>{record.schoolName}</td>
                                <td>{record.paymentMode}</td>
                                <td>{record.transactionDate}</td>
                                <td>{record.copiesVerified}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePayments;
