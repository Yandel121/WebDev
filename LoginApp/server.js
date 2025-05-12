const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sql = require('mssql');
const path = require('path');

dotenv.config();
console.log('Environment Variables:', process.env);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

const config = require('./config.server');
const dbConfig = config.db;
console.log('Database Configuration:', dbConfig);
// Database connection

console.log('Final DB Config:', dbConfig);

sql.connect(dbConfig)
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('Demo');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));

// Register route
app.post('/register', async (req, res) => {
    const { userId, email, password } = req.body;

    if (!userId || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('userId', sql.NVarChar, userId)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query('INSERT INTO Users (userId, email, password) VALUES (@userId, @email, @password)');

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

// Simulated database for user accounts
const users = {
    testUser: { password: '', email: '', bio: '', deleted: false },
};

// Delete account route
app.delete('/delete-account', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).send('Username is required.');
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('userId', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE userId = @userId');

        if (result.recordset.length > 0) {
            await pool.request()
                .input('userId', sql.NVarChar, username)
                .query('UPDATE Users SET deleted = 1 WHERE userId = @userId');

            res.status(200).json({ message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

// Updated login route
app.post('/login', async (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).send('UserId and password are required.');
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('userId', sql.NVarChar, userId)
            .input('password', sql.NVarChar, password)
            .query('SELECT * FROM Users WHERE userId = @userId AND password = @password AND deleted = 0');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.render('ProfilePage', {
                username: user.userId,
                email: user.email,
                bio: user.bio || '',
                joinedDate: new Date().toLocaleDateString(),
            });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

// Create bio route
app.post('/create-bio', async (req, res) => {
    const { username, bio } = req.body;

    if (!username || !bio) {
        return res.status(400).json({ error: 'Username and bio are required.' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('userId', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE userId = @userId AND deleted = 0');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            if (user.bio) {
                return res.status(400).json({ error: 'Bio already exists. Use the update API to modify it.' });
            }

            await pool.request()
                .input('userId', sql.NVarChar, username)
                .input('bio', sql.NVarChar, bio)
                .query('UPDATE Users SET bio = @bio WHERE userId = @userId');

            res.status(201).json({ message: 'Bio created successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update bio route
app.put('/update-bio', async (req, res) => {
    const { username, bio } = req.body;

    if (!username || !bio) {
        return res.status(400).send('Username and bio are required.');
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('userId', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE userId = @userId AND deleted = 0');

        if (result.recordset.length > 0) {
            await pool.request()
                .input('userId', sql.NVarChar, username)
                .input('bio', sql.NVarChar, bio)
                .query('UPDATE Users SET bio = @bio WHERE userId = @userId');

            res.status(200).json({ message: 'Bio updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

// Render profile page with updated bio
app.get('/profile', async (req, res) => {
    const username = 'testUser'; // Replace with session or actual user data

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('userId', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE userId = @userId AND deleted = 0');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.render('ProfilePage', {
                username: user.userId,
                email: user.email,
                bio: user.bio || '',
                joinedDate: 'March 2025',
            });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

app.get('/test-db', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.query('SELECT 1'); // Simple query to test the connection
        res.send('Database connection successful!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        res.status(500).send('Database connection failed: ' + error.message);
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
    .then(async response => {
        if (response.ok) {
            return response.json(); // Parse JSON if the response is OK
        } else {
            const errorText = await response.text(); // Parse plain text for errors
            throw new Error(errorText);
        }
    })
    .then(data => {
        console.log(data);
        // Handle success in the client-side code
    })
    .catch(error => {
        console.error('Error:', error.message); // Log the error in the server
    });

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
