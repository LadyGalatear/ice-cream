// Import the express module
import express from 'express';

// Create an express application
const app = express();

// Define a port number where server will listen
const PORT = 3000;

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

app.post('/order-confirm', (req, res) => {
    const order = {
        name: req.body.name,
        email: req.body.email,
        flavor: req.body.flavor,
        cone: req.body.cone,
        toppings: req.body.toppings ? req.body.toppings : "none",
        comments: req.body.comments,
        timestamp: new Date()
    };

    orders.push(order);

    res.render(`confirmation`, { order });
});

// Start server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at 
        http://localhost:${PORT}`);
});