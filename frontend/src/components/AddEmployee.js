import '../styling/AddEmployee.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEmployee = ({ onClose, onEmployeeAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        birthdate: '',
        salary: '',
        position: '',
        managerId: '',
    });

    const [managers, setManagers] = useState([]);

    // Fetch list of managers (all employees)
    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
                setManagers(response.data);
            } catch (error) {
                console.error("Error fetching manager list:", error);
            }
        };

        fetchManagers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // If "None" is selected, set managerId to null
            const adjustedFormData = { ...formData, managerId: formData.managerId || null };
            await axios.post(`${process.env.REACT_APP_API_URL}/employees`, adjustedFormData);
            onEmployeeAdded(); // Refresh the employee list
            onClose(); // Close the popup
        } catch (error) {
            console.error("Error creating employee:", error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Add New Employee</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    
                    <label>Surname:</label>
                    <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
                    
                    <label>Birthdate:</label>
                    <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
                    
                    <label>Salary:</label>
                    <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />
                    
                    <label>Position:</label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} required />
                    
                    <label>Manager ID (Optional):</label>
                    <select
                        name="managerId"
                        value={formData.managerId}
                        onChange={handleChange}
                    >
                        <option value="">None</option>
                        {managers.map((manager) => (
                            <option key={manager.employeeNumber} value={manager.employeeNumber}>
                                {manager.name} {manager.surname} ({manager.employeeNumber})
                            </option>
                        ))}
                    </select>

                    <button type="submit">Add Employee</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
