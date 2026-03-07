// Import the express module
import express from 'express';

import mysql2 from 'mysql2';

import dotenv from 'dotenv';

dotenv.config();

// Create an express application
const app = express();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

app.get('/db-test', async (req, res) => {
    try {
        const orders = await pool.query('SELECT * FROM orders');
        res.send(orders[0]);
    } catch (err) {
       console.error('Database error:', err);
       res.status(500).send('Database error: ' + err.message);
    }
});

// Define a port number where server will listen
const PORT = 3013;

// Enable static file serving
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const orders = [];

// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get('/', (req, res) => {
    res.render(`home`);
});

app.post('/order-confirm', async (req, res) => {
    try {
        // Get form data from req.body
        const order = req.body;         

        // Log the order data (for debugging)
        console.log('New order submitted:', order);

        // SQL INSERT query with placeholders to prevent SQL injection
        const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings) 
            VALUES (?, ?, ?, ?, ?);`;

        // Parameters array must match the order of ? placeholders
	    // Make sure your property names match your order names
        const params = [
            order.name,
            order.email,
		    order.flavor,
		    order.cone,
            Array.isArray(order.toppings) ? order.toppings.join(", ") : "none"
        ];

        // Execute the query and grab the primary key of the new row
        const result = await pool.execute(sql, params);
        console.log('Order saved with ID:', result[0].insertId);

        // Render confirmation page with the adoption data
        res.render('confirmation', { order });        

    } catch (err) {
        console.error('Error saving order:', err);
        res.status(500).send('Sorry, there was an error processing your order. Please try again.');
    }
});


app.get('/admin', async (req, res) => {
    try {
        // Fetch all orders from database, newest first
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');  

        // Render the admin page
        res.render('admin', { orders });        

    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

// Start server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at 
        http://localhost:${PORT}`);
});