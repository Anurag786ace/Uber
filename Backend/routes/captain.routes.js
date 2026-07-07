const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const captainController = require("../controllers/captain.controller");

router.post('/register',[
    body('email').isEmail().withMessage(" Please provide a valid E-Mail"),
    body('fullname.firstname').trim().notEmpty().isLength({min:3}).withMessage('First name is required'),
    body('fullname.lastname').trim().notEmpty().isLength({min:3}).withMessage('Last name is required'),
    body('password').isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body('vehicle.color').trim().notEmpty().isLength({min:3}).withMessage('Color is required'),
    body('vehicle.plate').trim().notEmpty().isLength({min:3}).withMessage('Plate is required'),
    body('vehicle.model').trim().notEmpty().isLength({min:3}).withMessage('Model is required'),
    body('vehicle.capacity').isInt({min:1, max:10}).withMessage('Capacity must be between 1 and 10'),
    body('vehicle.vehicleType').trim().notEmpty().isIn(['car', 'bike', 'auto', 'mini-van']).withMessage('Vehicle type must be car, bike, auto, or mini-van'),
    body('vehicle.location.lat').isNumeric().withMessage('Latitude is required'),
    body('vehicle.location.long').isNumeric().withMessage('Longitude is required'),
],
captainController.registerCaptain


)
module.exports = router;
