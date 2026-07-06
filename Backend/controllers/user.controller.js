const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const hashedPassword = await userModel.hashedPassword(password);

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email:email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({token,user});

    

}

module.exports.loginUser = async(req,res,next) =>{

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }

    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message:"Invalid credentials"});
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message:"Invalid credentials"});
    }

    const token = user.generateAuthToken();

    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'development' ? false : true,
        sameSite:process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
        maxAge:1000*60*60*24*7
    });

    res.status(200).json({token,user});

    
}

module.exports.getUserProfile = async(req,res,next) =>{
    res.status(200).json(req.user);
}

module.exports.userLogout = async(req,res,next) =>{
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if(token){
        await blackListTokenModel.create({token});
    }

    res.clearCookie('token');
    res.status(200).json({message:"Logout Successfully"});
}