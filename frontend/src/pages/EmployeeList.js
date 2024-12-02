import React, { useEffect, useState } from 'react';
import axios from 'axios';

import  '../styling/EmployeeList.css';
import AddEmployee from '../components/AddEmployee';
import ViewEmployee from '../components/ViewEmployee';

// Employee: {
//     name: (String) Eg) John
//     surname: (String) Eg) Doe
//     birthdate: (Date) Eg) 27/18/2003
//     employeeNumber: (String - Primary Key) Eg) 8362713
//     salary: (Float) Eg) 700.00
//     position: (String) Eg) CEO/Developer/etc.
//     managerId: (String - nullable (for certain positions)) Eg) 8294736
// }

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState(null); // State to hold the selected employee number
    const [openViewModal, setOpenViewModal] = useState(false); // State to control visibility of ViewEmployee modal
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [filters, setFilters] = useState({ // Filters
        position: '',
        minSalary: '',
        maxSalary: '',
        managerId: '',
    });

    const fetchEmployees = async (query = '') => {
        try {
            let response;
            if (query === '') {
                response = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
            } else {
                response = await axios.get(`${process.env.REACT_APP_API_URL}/employees/search/${query}`);
            }
            const employeesData = Array.isArray(response.data) ? response.data : [];
            setEmployees(employeesData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching employees:", error);
            alert("Failed to fetch employees. Please try again.");
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

    const handleSort = (field) => {
        if (sortField === field) {
            // Toggle sort order if the same field is clicked
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new field and default to ascending
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortedEmployees = () => {
        const filteredEmployees = getFilteredEmployees();
        if (!sortField) return filteredEmployees;

        return [...filteredEmployees].sort((a, b) => {
            const valA = a[sortField] || '';
            const valB = b[sortField] || '';

            if (typeof valA === 'string') {
                return sortOrder === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            if (typeof valA === 'number' || valA instanceof Date) {
                return sortOrder === 'asc' ? valA - valB : valB - valA;
            }

            return 0;
        });
    };

    const getFilteredEmployees = () => {
        return employees.filter((employee) => {
            const matchesPosition = !filters.position || employee.position === filters.position;
            const matchesMinSalary = !filters.minSalary || employee.salary >= parseFloat(filters.minSalary);
            const matchesMaxSalary = !filters.maxSalary || employee.salary <= parseFloat(filters.maxSalary);
            const matchesManagerId = !filters.managerId || employee.managerId === filters.managerId;
            return matchesPosition && matchesMinSalary && matchesMaxSalary && matchesManagerId;
        });
    };


    useEffect(() => {
        fetchEmployees();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="employee-list-container">
            <div className="filter-panel">
                <h2>Filters</h2>
                <div className="filter-group">
                    <label>Position:</label>
                    <input
                        type="text"
                        value={filters.position}
                        onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                        placeholder="e.g., Developer"
                    />
                </div>
                <div className="filter-group">
                    <label>Min Salary:</label>
                    <input
                        type="number"
                        value={filters.minSalary}
                        onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                        placeholder="e.g., 5000"
                    />
                </div>
                <div className="filter-group">
                    <label>Max Salary:</label>
                    <input
                        type="number"
                        value={filters.maxSalary}
                        onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                        placeholder="e.g., 10000"
                    />
                </div>
                <div className="filter-group">
                    <label>Manager ID:</label>
                    <input
                        type="text"
                        value={filters.managerId}
                        onChange={(e) => setFilters({ ...filters, managerId: e.target.value })}
                        placeholder="e.g., 12345"
                    />
                </div>
                <button onClick={() => setFilters({ position: '', minSalary: '', maxSalary: '', managerId: '' })}>
                    Reset Filters
                </button>
            </div>

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
                            <th
                                onClick={() => handleSort('name')}
                                className={sortField === 'name' ? 'active' : ''}
                            >
                                Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </th>
                            <th
                                onClick={() => handleSort('surname')}
                                className={sortField === 'surname' ? 'active' : ''}
                            >
                                Surname {sortField === 'surname' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </th>
                            <th
                                onClick={() => handleSort('birthdate')}
                                className={sortField === 'birthdate' ? 'active' : ''}
                            >
                                Birthdate {sortField === 'birthdate' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </th>
                            <th
                                onClick={() => handleSort('employeeNumber')}
                                className={sortField === 'employeeNumber' ? 'active' : ''}
                            >
                                Employee Number {sortField === 'employeeNumber' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </th>
                            <th
                                onClick={() => handleSort('salary')}
                                className={sortField === 'salary' ? 'active' : ''}
                            >
                                Salary {sortField === 'salary' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </th>
                            <th
                                onClick={() => handleSort('position')}
                                className={sortField === 'position' ? 'active' : ''}
                            >
                                Position {sortField === 'position' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </th>
                            <th
                                onClick={() => handleSort('managerId')}
                                className={sortField === 'managerId' ? 'active' : ''}
                            >
                                Manager ID {sortField === 'managerId' && (sortOrder === 'asc' ? '▲' : '▼')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(getSortedEmployees()) ? (
                            getSortedEmployees().map((employee) => (
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
        </div>
    );
};

export default EmployeeList;