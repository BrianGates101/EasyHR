require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes, Op } = require('sequelize');
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
        primaryKey: true,
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
        type: DataTypes.STRING,
        allowNull: true,  // This is optional since not all employees have a manager
    },
});

// CRUD Endpoints
// Get all employees
app.get('/', async (req, res) => {
    res.send("Error 404 : Looking for another page?")
});

// Fuzzy search for employees 
app.get('/employees/search/:term', async (req, res) => {
    const searchTerm = `%${req.params.term}%`; // Prepare the search term for LIKE query
    // const searchTerm = req.params.term; // Prepare the search term for LIKE query
    try {
        const employees = await Employee.findAll({
            where: {
                [Op.or]: [
                    sequelize.where(sequelize.cast(sequelize.col('name'), 'text'), { [Op.like]: searchTerm }),
                    sequelize.where(sequelize.cast(sequelize.col('surname'), 'text'), { [Op.like]: searchTerm }),
                    sequelize.where(sequelize.cast(sequelize.col('birthdate'), 'text'), { [Op.like]: searchTerm }),
                    sequelize.where(sequelize.cast(sequelize.col('employeeNumber'), 'text'), { [Op.like]: searchTerm }),
                    sequelize.where(sequelize.cast(sequelize.col('salary'), 'text'), { [Op.like]: searchTerm }),
                    sequelize.where(sequelize.cast(sequelize.col('position'), 'text'), { [Op.like]: searchTerm }),
                    sequelize.where(sequelize.cast(sequelize.col('managerId'), 'text'), { [Op.like]: searchTerm })
                ]
            }
        });
        res.json(employees);
    } catch (error) {
        console.log(`Internal server error: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
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
    const { name, surname, birthdate, salary, position, managerId } = req.body;

    try {
        const employeeNumber = await generateEmployeeNumber(); // Generate a unique employee number

        const newEmployee = await Employee.create({
            name,
            surname,
            birthdate,
            salary,
            position,
            managerId: managerId || null,  // Handle optional managerId
            employeeNumber,  // Automatically assigned employeeNumber
        });

        res.status(201).json(newEmployee);  // Respond with the newly created employee
    } catch (error) {
        console.log(`Internal server error: ${error.message}`)
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const generateEmployeeNumber = async () => {
    let employeeNumber;
    do {
        // Generate a random 7-digit number as a string (pad with leading zeros if necessary)
        employeeNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
    } while (await Employee.findOne({ where: { employeeNumber } }));  // Check if it already exists in DB
    return employeeNumber;
};

// Update an employee
app.put('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findOne({where: {employeeNumber: req.params.id}});
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
    } catch (error) {
        console.log(`Internal server error: ${error.message}`)
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findOne({where: {employeeNumber: req.params.id}});
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
