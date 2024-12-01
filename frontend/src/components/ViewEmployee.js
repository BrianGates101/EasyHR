import '../styling/ViewEmployee.css';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

const ViewEmployee = ({ employeeNumber, open, handleClose }) => {
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        if (employeeNumber) {
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

    if (!employee) return null;

    // return (
    //     <Dialog open={open} onClose={handleClose}>
    //         <DialogTitle>Employee Details</DialogTitle>
    //         <DialogContent>
    //             <Typography variant="h6">{employee.name} {employee.surname}</Typography>
    //             <Typography variant="body1">Employee Number: {employee.employeeNumber}</Typography>
    //             <Typography variant="body1">Position: {employee.position}</Typography>
    //             <Typography variant="body1">Salary: R {employee.salary}.00</Typography>
    //             <Typography variant="body1">Birthdate: {new Date(employee.birthdate).toLocaleDateString()}</Typography>
    //             <Typography variant="body1">Manager: {employee.managerId ? `Employee ${employee.managerId}` : "None"}</Typography>
    //         </DialogContent>
    //         <DialogActions>
    //             <Button onClick={handleClose} color="primary">Close</Button>
    //         </DialogActions>
    //     </Dialog>
    // );
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
                    <button className="delete-button">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ViewEmployee;
