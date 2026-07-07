const captainModel = require("../models/captain.model");

module.exports.createCaptain = async ({
    firstName,
    lastName,
    email,
    password,
    color,
    plate,
    model,
    capacity,
    vehicleType,
    location,
}) => {
    if(!firstName || !lastName || !email || !password || !color || !plate || !model || !capacity || !vehicleType || !location){
        throw new Error(" All fields are required ")
    }

    const captain = await captainModel.create({
        fullname : {firstname: firstName, lastname: lastName},
        email,
        password,
        vehicle:{color,
        plate,
        model,
        capacity,
        vehicleType,
        location},
    })

    return captain;
}





