// Import express
let express = require('express');

// Initialize the app
let app = express();

// Import routes
let apiRoutes = require("./api-routes");

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get('/', (req, res) => res.send('Look at the README to use this API properly.'));

// Use Api routes in the App
app.use('/api', apiRoutes);

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running Sinapps API on port : " + port);
});