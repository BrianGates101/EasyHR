require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize(
    process.env.DB_URL, { 
        dialect: 'postgres', 
        dialectOptions: { 
            ssl: { 
                require: true, // This will force SSL 
                rejectUnauthorized: false // This can be set to true if you have a valid SSL certificate 
            } 
        },
        pool: { 
            max: 10, // maximum number of connection in pool 
            min: 0, // minimum number of connection in pool 
            acquire: 30000, // maximum time (ms) that a connection can be idle before being released 
            idle: 10000 // maximum time (ms) that pool will try to get connection before throwing error 
        } 
    });

sequelize
    .sync()
    .then(() => {
        console.log("Database Connected Successfully")
    })
    .catch((err) => {
        console.log(`Database Connection Error: ${err}`)
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
app.get('/', async (req, res) => {
    res.send("Error 404 : Looking for another page?")
});

app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        console.log(`Internal server error: ${error.message}`)
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create a new employee
app.post('/employees', async (req, res) => {
    try {
        const { name, surname, birthdate, employeeNumber, salary, position, managerId } = req.body;
        const employee = await Employee.create({ name, surname, birthdate, employeeNumber, salary, position, managerId });
        res.status(201).json(employee);
    } catch (error) {
        console.log(`Internal server error: ${error.message}`)
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update an employee
app.put('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findOne({where: {employeeNumber: req.params.id}});
        // const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const { name, surname, birthdate, employeeNumber, salary, position, managerId } = req.body;

        // Update employee attributes 
        await employee.update({ 
            name, 
            surname, 
            birthdate, 
            employeeNumber, 
            salary, 
            position, 
            managerId 
        }); 

        res.json(employee);

        // employee.name = name;
        // employee.surname = surname;
        // employee.birthdate = birthdate;
        // employee.employeeNumber = employeeNumber;
        // employee.salary = salary;
        // employee.position = position;
        // employee.managerId = managerId;

        // await employee.save();
        // res.json(employee);
    } catch (error) {
        console.log(`Internal server error: ${error.message}`)
        res.status(500).json({ message: "Internal Server Error" });
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
        console.log(`Internal server error: ${error.message}`)
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
