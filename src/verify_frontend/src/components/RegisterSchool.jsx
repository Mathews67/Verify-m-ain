import React, { useState, useEffect } from 'react';
import './RegisterSchool.css'; // Add any necessary CSS styles
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons

const RegisterSchool = () => {
  const [schools, setSchools] = useState([]);
  const [schoolName, setSchoolName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Default school names
  const defaultSchools = [
    'Chalimbana University',
    'Mukuba University',
    'University of Zambia',
    'Copperbelt University',
    'Mulungushi University',
    'Kapasa Makasa University',
    'Apex University',
    'Cavendish University'
  ];

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    // Replace with your actual fetch logic to get schools
    const response = await fetch('/api/schools');
    const data = await response.json();
    setSchools(data);
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedSchools = [...schools];
      updatedSchools[editIndex] = { name: schoolName };
      await updateSchool(updatedSchools);
      setSchools(updatedSchools);
    } else {
      const newSchool = { name: schoolName };
      await addSchool(newSchool);
      setSchools([...schools, newSchool]);
    }
    resetForm();
  };

  const addSchool = async (school) => {
    // Implement your API logic to add a new school
    await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(school),
    });
  };

  const updateSchool = async (updatedSchools) => {
    // Implement your API logic to update the school
    await fetch('/api/schools', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSchools),
    });
  };

  const handleEdit = (index) => {
    setSchoolName(schools[index].name);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const schoolToDelete = schools[index];
    await deleteSchool(schoolToDelete);
    const updatedSchools = schools.filter((_, i) => i !== index);
    setSchools(updatedSchools);
  };

  const deleteSchool = async (school) => {
    // Implement your API logic to delete a school
    await fetch(`/api/schools/${school.name}`, {
      method: 'DELETE',
    });
  };

  const resetForm = () => {
    setSchoolName('');
    setIsEditing(false);
    setEditIndex(null);
  };

  return (
    <div className="register-school">
      <h2>Register School</h2>
      <form onSubmit={handleAddSchool}>
        <select
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          required
        >
          <option value="" disabled>Select a school</option>
          {defaultSchools.map((school) => (
            <option key={school} value={school}>{school}</option>
          ))}
        </select>
        <button type="submit" className="add-btn">
          <FaPlus /> {isEditing ? 'Update' : 'Add'} School
        </button>
        <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
      </form>
      <ul>
        {schools.map((school, index) => (
          <li key={index}>
            {school.name}
            <button onClick={() => handleEdit(index)} className="edit-btn">
              <FaEdit />
            </button>
            <button onClick={() => handleDelete(index)} className="delete-btn">
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisterSchool;
