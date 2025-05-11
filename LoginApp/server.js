const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sql = require('mssql');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
};

// View Engine Setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
  
app.get('/', function(req, res){ 
    res.render('Demo') 
}) 

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));

//Obtener todas las tareas

app.get('/tasks', async (req,res) => {
    try{
        const pool=await sql.connect(dbConfig);
        const result= await pool.request().query('SELECT * FROM Tasks');
        res.json(result.recordset);
    } catch (error){
        res.status(500).send(error.message);
    }
});

// Register route
app.post('/register', (req, res) => {
    const { userId, email, password } = req.body;
    if (!userId || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    // Add the user to the simulated database
    users[userId] = { password, email, bio: '', deleted: false };

    // Pass user data to the profile page
    res.render('ProfilePage', {
        username: userId, // Ensure this is correctly passed
        email: users[userId].email,
        bio: users[userId].bio || '', // Default to an empty string if bio is not set
        joinedDate: new Date().toLocaleDateString(),
    });
});

// Simulated database for user accounts
const users = {
    testUser: { password: '', email: '', bio: '', deleted: false },
};

// Delete account route
app.delete('/delete-account', (req, res) => {
    const { username } = req.body;

    if (users[username]) {
        users[username].deleted = true;
        res.status(200).json({ message: 'Account deleted successfully' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Updated login route
app.post('/login', (req, res) => {
    const { UserId, password } = req.body;

    // Check if the user exists and is not deleted
    if (users[UserId] && !users[UserId].deleted && users[UserId].password === password) {
        // Pass user data to the profile page
        res.render('ProfilePage', {
            username: UserId,
            email: users[UserId].email,
            bio: users[UserId].bio, // Include bio
            joinedDate: 'March 2025', // Example joined date
        });
    } else if (users[UserId] && users[UserId].deleted) {
        res.status(403).send('This account has been deleted.');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Create bio route
app.post('/create-bio', (req, res) => {
    const { username, bio } = req.body;

    if (users[username]) {
        if (users[username].bio) {
            return res.status(400).json({ error: 'Bio already exists. Use the update API to modify it.' });
        }
        users[username].bio = bio;
        res.status(201).json({ message: 'Bio created successfully' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Update bio route
app.put('/update-bio', (req, res) => {
    const { username, bio } = req.body;

    if (users[username]) {
        // If bio does not exist, create it
        users[username].bio = bio;
        res.status(200).json({ message: 'Bio updated successfully' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Render profile page with updated bio
app.get('/profile', (req, res) => {
    const username = 'testUser'; // Replace with session or actual user data

    // Check if the user exists
    if (users[username]) {
        res.render('ProfilePage', {
            username: username,
            email: users[username].email,
            bio: users[username].bio, // Include bio
            joinedDate: 'March 2025', // Example joined date
        });
    } else {
        res.status(404).send('User not found');
    }
});

// Actualizar tarea

app.put('/tasks/:id', async (req, res)=> {
    const { id } = req.params;
    const {title,description,status} =req.body;
    try{
        const pool= await sql.connect(dbConfig);
        await pool.request()
        .input('id', sql.Int, id)
        .input('title',sql.VarChar,title)
        .input('description', sql.VarChar,description)
        .input('status', sql.VarChar,status)
        .query('UPDATE Task SET title=@title, description=@description, status=@status WHERE id=@id');
    res.send('Tarea actualizada exitosamente');
    } catch (error){
        res.status(500).send(error.message);
    }
});

// Eliminar una tarea
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Tasks WHERE id=@id');
        res.send('Tarea eliminada exitosamente');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

fetch(`${BASE_URL}/create-bio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: '', bio: '' }),
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

fetch('http://localhost:3000/update-bio', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'testUser', bio: 'Updated bio' }),
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

function saveBio() {
    const updatedBio = document.getElementById('bio-edit').value;

    fetch('/update-bio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: '<%= username %>', bio: updatedBio })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            document.getElementById('bio-text').textContent = updatedBio;
            document.getElementById('bio-text').style.display = 'block';
            document.getElementById('bio-edit').style.display = 'none';
            document.getElementById('save-bio-btn').style.display = 'none';
            document.getElementById('edit-bio-icon').style.display = 'inline-block';
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}
