import React, { useEffect, useState } from 'react';
import axios from 'axios';

import  '../styling/EmployeeList.css';
import AddEmployee from '../components/AddEmployee';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
            setEmployees(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setLoading(false);
        }
    };

    const handleAddEmployee = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="employee-list">
            <h1>Employee List</h1>
            <button onClick={handleAddEmployee}>Add New Employee</button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Birthdate</th>
                        <th>Employee Number</th>
                        <th>Salary</th>
                        <th>Position</th>
                        <th>Manager ID</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.employeeNumber}>
                            <td>{employee.name}</td>
                            <td>{employee.surname}</td>
                            <td>{employee.birthdate}</td>
                            <td>{employee.employeeNumber}</td>
                            <td>{employee.salary}</td>
                            <td>{employee.position}</td>
                            <td>{employee.managerId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showPopup && (
                <AddEmployee
                    onClose={handleClosePopup}
                    onEmployeeAdded={fetchEmployees}
                />
            )}
        </div>
    );
};

export default EmployeeList;
