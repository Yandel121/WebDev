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

    // Pass user data to the profile page
    res.render('ProfilePage', {
        username: userId,
        email: email,
        joinedDate: new Date().toLocaleDateString(), // Example: current date
    });
});

app.post('/login', (req, res) => {
    const { UserId, password } = req.body;

    // Replace this with actual database validation
    if (UserId === 'testUser' && password === 'password123') {
        // Pass user data to the profile page
        res.render('ProfilePage', {
            username: UserId,
            email: 'testUser@example.com', // Example email
            joinedDate: 'March 2025', // Example joined date
        });
    } else {
        res.status(401).send('Invalid credentials');
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
