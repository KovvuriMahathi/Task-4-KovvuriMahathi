const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample Data
const interns = [
    {
        id: 1,
        name: "Rahul",
        department: "Frontend"
    },
    {
        id: 2,
        name: "Priya",
        department: "Backend"
    },
    {
        id: 3,
        name: "Kiran",
        department: "Full Stack"
    }
];

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to the Internship API");
});

// =======================
// GET API - Get all interns
// =======================
app.get("/api/interns", (req, res) => {
    res.json(interns);
});

// =======================
// POST API - Add a new intern
// =======================
app.post("/api/interns", (req, res) => {

    const { name, department } = req.body;

    const newIntern = {
        id: interns.length + 1,
        name,
        department
    };

    interns.push(newIntern);

    res.status(201).json({
        message: "Intern added successfully!",
        intern: newIntern
    });

});

// =======================
// DELETE API - Delete an intern
// =======================
app.delete("/api/interns/:id", (req, res) => {

    const id = parseInt(req.params.id);

    // Find the intern index
    const index = interns.findIndex(intern => intern.id === id);

    // If intern is not found
    if (index === -1) {
        return res.status(404).json({
            message: "Intern not found"
        });
    }

    // Remove intern from array
    interns.splice(index, 1);

    res.json({
        message: "Intern deleted successfully"
    });

});
// =======================
// PUT API - Update an intern
// =======================
app.put("/api/interns/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const { name, department } = req.body;

    const intern = interns.find(i => i.id === id);

    if (!intern) {
        return res.status(404).json({
            message: "Intern not found"
        });
    }

    intern.name = name;
    intern.department = department;

    res.json({
        message: "Intern updated successfully!",
        intern: intern
    });

});

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});