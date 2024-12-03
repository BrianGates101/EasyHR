import '../styling/EditEmployee.css';
import SaveConfirmation from './SaveConfirmation'; // Import the SaveConfirmation modal

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditEmployee = ({ employeeNumber, onSave, onCancel }) => {
    const [employee, setEmployee] = useState({
        name: '',
        surname: '',
        birthdate: '',
        salary: '',
        position: '',
        managerId: '',
    });

    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false); // State for showing save confirmation modal

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/${employeeNumber}`);
                setEmployee(response.data);
            } catch (error) {
                console.error("Error fetching employee details:", error);
            }
        };
        fetchEmployeeDetails();
    }, [employeeNumber]);

    const handleSaveClick = () => {
        setShowSaveConfirmation(true); // Show the save confirmation modal
    };

    const handleSaveCancel = () => {
        setShowSaveConfirmation(false); // Close the save confirmation modal
    };

    const handleSaveConfirm = async () => {
        try {
            // Send PUT request to update employee details
            await axios.put(`${process.env.REACT_APP_API_URL}/employees/${employeeNumber}`, employee);
            onSave(); // Call the onSave function to update the parent modal
        } catch (error) {
            console.error("Error saving employee details:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    return (
        <div className="edit-employee-modal">
            <div className="edit-modal-content">
                {/* Close Button (Top-right "X") */}
                <button className="edit-close-button" onClick={onCancel}>X</button>

                <h2>Edit Employee</h2>
                <form>
                    <div className="edit-form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={employee.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="edit-form-group">
                        <label htmlFor="surname">Surname</label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            value={employee.surname}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="edit-form-group">
                        <label htmlFor="birthdate">Birthdate</label>
                        <input
                            type="date"
                            id="birthdate"
                            name="birthdate"
                            value={employee.birthdate.slice(0, 10)} // Formatting date to yyyy-mm-dd
                            onChange={handleChange}
                        />
                    </div>

                    <div className="edit-form-group">
                        <label htmlFor="salary">Salary</label>
                        <input
                            type="number"
                            id="salary"
                            name="salary"
                            value={employee.salary}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="edit-form-group">
                        <label htmlFor="position">Position</label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            value={employee.position}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="edit-form-group">
                        <label htmlFor="managerId">Manager ID</label>
                        <input
                            type="text"
                            id="managerId"
                            name="managerId"
                            value={employee.managerId || ''}
                            onChange={handleChange}
                        />
                    </div>
                </form>

                <div className="edit-modal-buttons">
                    <button className="edit-cancel-button" onClick={onCancel}>Cancel</button>
                    <button className="edit-save-button" onClick={handleSaveClick}>Save</button>
                </div>
            </div>

            {/* Save Confirmation Modal */}
            {showSaveConfirmation && (
                <SaveConfirmation
                    onConfirm={handleSaveConfirm}
                    onCancel={handleSaveCancel}
                />
            )}
        </div>
    );
};

export default EditEmployee;
