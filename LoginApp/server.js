const express = require('express');
const path = require('path');
const { connectDB, config } = require('./config');
const sql = require('mssql');
const app = express();
const port = process.env.PORT || 3000;

// Initialize express app
const session = require('express-session');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));


// Establish database connection
connectDB();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Home route
app.get('/', (req, res) => {
    res.render('Demo');
});

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        await pool.query('SELECT 1'); // Simple query to test the connection
        res.send('Database connection successful!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        res.status(500).send('Database connection failed: ' + error.message);
    }
});

app.post('/register', async (req, res) => {
    const { userId, email, password } = req.body;

    if (!userId || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('userId', sql.NVarChar, userId)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query('INSERT INTO Users (userId, email, password) VALUES (@userId, @email, @password)');

        // ✅ Store user in session before redirecting
        req.session.user = { userId, email }; // Add user to session
        console.log('User stored in session:', req.session.user);

        // ✅ Redirect to profile page after successful registration
        res.redirect('/profile');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});




// Login route
// 🚀 **Login Route**
app.post('/login', async (req, res) => {
    console.log('Login request:', req.body);

    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).send('UserId and password are required.');
    }

    try {
        const pool = await sql.connect(config);

        // Fetch user without filtering by password
        const result = await pool.request()
            .input('userId', sql.NVarChar, userId)
            .query('SELECT * FROM Users WHERE userId = @userId AND deleted = 0');

        console.log('User Data:', result.recordset); // Debugging output

        if (result.recordset.length > 0) {
            const user = result.recordset[0];

            console.log('User ID:', user.userId);
            console.log('Database Password:', user.password);
            console.log('Input Password:', password);

            // 🔎 **Compare passwords**
            if (user.password.trim() === password.trim()) {
                req.session.user = user; // ✅ Store user in session
                console.log('User stored in session:', req.session.user);

                res.redirect('/profile'); // Redirect after successful login
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Login API Error:', error.message);
        res.status(500).send(error.message);
    }
});
// 🚀 **Profile Route**
app.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('User not authenticated');
    }

    console.log('Fetching profile for session:', req.session.user);

    const user = req.session.user;

    let formattedDate = 'Unknown';
    if (user.createdAt) {
        try {
            formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date conversion error:', error);
        }
    }

    res.render('ProfilePage', {
        username: user.userId,
        email: user.email,
        bio: user.bio || 'No bio available',
        joinedDate: formattedDate,
    });
});



// Create bio route
app.post('/create-bio', async (req, res) => {
    const { username, bio } = req.body;

    if (!username || !bio) {
        return res.status(400).json({ error: 'Username and bio are required.' });
    }

    try {
        const pool = await sql.connect(config);
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
        const pool = await sql.connect(config);
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



// Delete account route
app.delete('/delete-account/:userId', async (req, res) => {
    const { userId } = req.params; // Correctly destructure userId

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.NVarChar, userId)
            .query('UPDATE Users SET deleted = 1 WHERE userId = @userId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('User not found');
        }

        res.status(200).send('Account marked as deleted successfully');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

body: JSON.stringify({ username: '<%= username %>' }) // Ensure <%= username %> is rendered correctly
