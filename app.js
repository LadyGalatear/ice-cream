// Import the express module
import express from 'express';

// Create an express application
const app = express();

// Define a port number where server will listen
const PORT = 3000;

// Enable static file serving
app.use(express.static('public'));

// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get('/', (req, res) => {
    res.send('Welcome to My Ice Cream Shop!')
});

// Start server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at 
        http://localhost:${PORT}`);
});