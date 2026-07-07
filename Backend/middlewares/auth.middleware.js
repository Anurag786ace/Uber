const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const isBlackListed = await blackListTokenModel.findOne({ token: token });

        if (isBlackListed) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || typeof decoded === 'string' || !decoded._id) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const isBlackListed = await blackListTokenModel.findOne({ token: token });

        if (isBlackListed) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || typeof decoded === 'string' || !decoded._id) {
            return res.status(401).json({ message: "Invalid Token" });
        }
        const captain = await captainModel.findById(decoded._id);
        if (!captain) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.captain = captain;
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
}
