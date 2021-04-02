// api-routes.js
// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Working',
        message: 'Look at the README to see how to use this API.',
    });
});

// Import parking controller
var parkingController = require('./parkingController');

// parking routes
router.route('/parkings')
    .get(parkingController.all)

router.route('/parkings/:position')
    .get(parkingController.near_me)


// Export API routes
module.exports = router;