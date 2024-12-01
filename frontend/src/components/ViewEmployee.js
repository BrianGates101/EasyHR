import '../styling/ViewEmployee.css';
import EditEmployee from './EditEmployee'; // Import the EditEmployee modal
import DeleteConfirmation from './DeleteConfirmation'; // Import the DeleteConfirmation modal

import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewEmployee = ({ employeeNumber, open, handleClose, onEmployeeListUpdate }) => {
    const [employee, setEmployee] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for showing delete confirmation modal
    const [showEditEmployee, setShowEditEmployee] = useState(false); // State for showing edit employee modal

    useEffect(() => {
        if (open) {
            // Fetch the employee details when the modal is open
            const fetchEmployeeDetails = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/${employeeNumber}`);
                    setEmployee(response.data);
                } catch (error) {
                    console.error("Error fetching employee details:", error);
                }
            };
            fetchEmployeeDetails();
        }
    }, [open, employeeNumber]);

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true); // Show the delete confirmation modal
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false); // Close the delete confirmation modal
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/employees/${employeeNumber}`); // DELETE request to API
            handleClose(); // Close the ViewEmployee modal
            onEmployeeListUpdate(); // Refresh the employee list on the parent
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    const handleEditClick = () => {
        setShowEditEmployee(true); // Show the EditEmployee modal
    };

    const handleEditClose = () => {
        setShowEditEmployee(false); // Close the EditEmployee modal
    };

    const handleEmployeeUpdated = () => {
        // Refresh employee data after saving edit
        const fetchEmployeeDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/${employeeNumber}`);
                setEmployee(response.data);
            } catch (error) {
                console.error("Error fetching employee details:", error);
            }
        };
        fetchEmployeeDetails();
        handleEditClose(); // Close the EditEmployee modal
    };

    if (!open || !employee) {
        return null;
    }

    return (
        <div className="view-employee-modal">
            <div className="modal-content">
                {/* Close Button (Top-right "X") */}
                <button className="close-button" onClick={handleClose}>X</button>

                <div className="employee-details">
                    <h2>Employee Details</h2>
                    <p><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Surname:</strong> {employee.surname}</p>
                    <p><strong>Birthdate:</strong> {new Date(employee.birthdate).toLocaleDateString()}</p>
                    <p><strong>Employee Number:</strong> {employee.employeeNumber}</p>
                    <p><strong>Salary:</strong> {employee.salary}</p>
                    <p><strong>Position:</strong> {employee.position}</p>
                    <p><strong>Manager ID:</strong> {employee.managerId || "None"}</p>
                </div>

                {/* Buttons at the bottom-right */}
                <div className="modal-buttons">
                <button className="edit-button" onClick={handleEditClick}>Edit</button>
                    <button className="delete-button" onClick={handleDeleteClick}>Delete</button>
                </div>
            </div>

            {/* EditEmployee Modal */}
            {showEditEmployee && (
                <EditEmployee
                    employeeNumber={employeeNumber}
                    onSave={handleEmployeeUpdated} // Close the modal and refresh the parent
                    onCancel={handleEditClose} // Close the modal without changes
                />
            )}

            {/* Confirmation Modal */}
            {showDeleteConfirmation && (
                <DeleteConfirmation
                    employeeName={`${employee.name} ${employee.surname}`}
                    onDelete={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </div>
    );
};

export default ViewEmployee;
