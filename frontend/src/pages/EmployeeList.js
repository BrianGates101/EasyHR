import React, { useEffect, useState } from 'react';
import axios from 'axios';

import  '../styling/EmployeeList.css';
import AddEmployee from '../components/AddEmployee';
import ViewEmployee from '../components/ViewEmployee';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState(null); // State to hold the selected employee number
    const [openViewModal, setOpenViewModal] = useState(false); // State to control visibility of ViewEmployee modal
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const fetchEmployees = async (query = '') => {
        try {
            if (query == '') {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
                const employeesData = Array.isArray(response.data) ? response.data : [];
                console.log("API Response:", response.data); // Log the response data
                setEmployees(employeesData);
                setLoading(false);
            } else {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/search/${query}`);
                const employeesData = Array.isArray(response.data) ? response.data : [];
                console.log("API Response:", response.data); // Log the response data
                setEmployees(employeesData);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
            setLoading(false);
        }
    };

    const handleAddEmployee = () => setShowPopup(true);
    const handleClosePopup = () => setShowPopup(false);

    const handleViewEmployee = (employeeNumber) => {
        setSelectedEmployeeNumber(employeeNumber); // Set the selected employee number
        setOpenViewModal(true); // Open the modal
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false); // Close the modal
        setSelectedEmployeeNumber(null); // Reset selected employee number
        fetchEmployees();
    };

    const handleEmployeeListUpdate = () => {
        // Fetch updated employee data after any change (edit or delete)
        fetchEmployees();
    };

    const handleSearch = () => {
        fetchEmployees(searchQuery); // Perform the search with the entered query
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="employee-list">
            <h1>Employee List</h1>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
                />
                <button onClick={handleSearch}>Search</button>
            </div>

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
                    {Array.isArray(employees) ? (
                        employees.map((employee) => (
                            <tr key={employee.employeeNumber} onClick={() => handleViewEmployee(employee.employeeNumber)}>
                                <td>{employee.name}</td>
                                <td>{employee.surname}</td>
                                <td>{new Date(employee.birthdate).toLocaleDateString()}</td>
                                <td>{employee.employeeNumber}</td>
                                <td>{employee.salary}</td>
                                <td>{employee.position}</td>
                                <td>{employee.managerId}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No employees found</td>
                        </tr>
                    )}
                    {/* {employees.map((employee) => (
                        <tr key={employee.employeeNumber} onClick={() => handleViewEmployee(employee.employeeNumber)}>
                            <td>{employee.name}</td>
                            <td>{employee.surname}</td>
                            <td>{new Date(employee.birthdate).toLocaleDateString()}</td>
                            <td>{employee.employeeNumber}</td>
                            <td>{employee.salary}</td>
                            <td>{employee.position}</td>
                            <td>{employee.managerId}</td>
                        </tr>
                    ))} */}
                </tbody>
            </table>
            {showPopup && (
                <AddEmployee
                    onClose={handleClosePopup}
                    onEmployeeAdded={fetchEmployees}
                />
            )}
            {openViewModal && (
                <ViewEmployee
                    employeeNumber={selectedEmployeeNumber}
                    open={openViewModal}
                    handleClose={handleCloseViewModal}
                    onEmployeeListUpdate={handleEmployeeListUpdate}
                />
            )}
        </div>
    );
};

export default EmployeeList;
