const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken");

const register = async (req,res,next) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt)


        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
        })

        await newUser.save();
        res.status(200).send("User has been created.")
    } catch (err) {
         next(err)
    }
}



const login = async (req,res,next) => {
    try {

        const user = await User.findOne({username:req.body.username});
        if(!user) return next(createError(404, "User not found"));

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if(!isPasswordMatch) 
          return next(createError(400,"Wrong password or username!"));

          const token = jwt.sign({ id:user._id, isAdmin:user.isAdmin }, process.env.JWT_SECRET);
         
        const { password, isAdmin, ...others } = user._doc

        res.cookie("access_token", token, { httpOnly:true, }).status(200).json({...others});
    } catch (err) {
         next(err)
    }
}



module.exports = { register, login }