const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the PostgreSQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

// Define the Employee Model
const Employee = sequelize.define('Employee', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthdate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    employeeNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    salary: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // This is optional since not all employees have a manager
    },
});

// CRUD Endpoints
// Get all employees
app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new employee
app.post('/employees', async (req, res) => {
    try {
        const { name, surname, birthdate, employeeNumber, salary, position, managerId } = req.body;
        const employee = await Employee.create({ name, surname, birthdate, employeeNumber, salary, position, managerId });
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an employee
app.put('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const { name, surname, birthdate, employeeNumber, salary, position, managerId } = req.body;
        employee.name = name;
        employee.surname = surname;
        employee.birthdate = birthdate;
        employee.employeeNumber = employeeNumber;
        employee.salary = salary;
        employee.position = position;
        employee.managerId = managerId;

        await employee.save();
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        await employee.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
