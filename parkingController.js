// parkingController.js

// Import parking model
parking = require('./parkingModel');

// Handle parkings info
exports.all = function (req, res) {
    parking.get(function (err, parkings) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "All parkings retrieved successfully",
            data: parkings
        });
    });
};

// Handle parkings info near me
exports.near_me = function (req, res) {
    parking.get_with_position(req.params.position, function (err, parkings) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Parkings near position (2kms radius) retrieved successfully",
            data: parkings
        });
    });
};