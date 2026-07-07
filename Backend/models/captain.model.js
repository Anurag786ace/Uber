const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const captainSchema = new Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [3, 'First Character must 3 character long'],
        },
        lastname: {
            type: String,
            required: true,
            minLength: [3, 'Last Character must 3 character long'],
        }
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please provide valid email"]


    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: 6,
        trim: true
    },
    socketId: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["online", "offline", "onride"],
        default: "offline"
    },

    vehicle: {
        color: {
            type: String,
            required: true,
            minLength: [3, "Vehicle Must Be 3 Character Long"]

        },

        plate: {
            type: String,
            required: true,
            trim: true,
            unique: true

        },

        capacity: {
            type: Number,
            required: true,
            min: [1, "Capacity Must Be 1 or more"],
            max: [10, "Capacity Must Be 10 or less"]
        },

        model: {
            type: String,
            required: true,
            minLength: [3, "Model Must Be 3 Character Long"]
        },

        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'bike', 'auto', 'mini-van'],
            default: 'car'
        },

        location: {
            lat: {
                type: Number,
                required: true
            },

            long: {
                type: Number,
                required: true
            }
        }





    },



});


captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
};

captainSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
};

captainSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password,10)

}

const captainModel = mongoose.model('captain', captainSchema);
module.exports = captainModel;


