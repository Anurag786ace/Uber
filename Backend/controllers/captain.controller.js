const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');

module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: "Captain already exist" });
    }

    // @ts-ignore - hashPassword is a Mongoose static method defined on the schema
    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstName: fullname.firstname,
        lastName: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        model: vehicle.model,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
        location: vehicle.location,
    });

    // @ts-ignore - generateAuthToken is a Mongoose instance method defined on the schema
    const token = captain.generateAuthToken();
    res.status(201).json({
        token, captain
    });

};

module.exports.captainLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = captain.generateAuthToken();

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.status(200).json({ token, captain });

}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json(req.captain);
}

module.exports.captainLogout = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
        await blackListTokenModel.create({ token });
    }

    res.clearCookie('token');
    res.status(200).json({ message: "Logout Successfully" });
}
