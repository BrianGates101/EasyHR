import '../styling/ViewEmployee.css';
import DeleteConfirmation from './DeleteConfirmation';

import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewEmployee = ({ employeeNumber, open, handleClose }) => {
    const [employee, setEmployee] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for showing delete confirmation modal

    useEffect(() => {
        if (employeeNumber && open) {
            axios
                .get(`${process.env.REACT_APP_API_URL}/employees/${employeeNumber}`)
                .then((response) => {
                    setEmployee(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching employee details:", error);
                });
        }
    }, [employeeNumber]);

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
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
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
                    <button className="edit-button">Edit</button>
                    <button className="delete-button" onClick={handleDeleteClick}>Delete</button>
                </div>
            </div>

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
