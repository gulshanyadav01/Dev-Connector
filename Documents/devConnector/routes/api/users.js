const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator"); 
const { restart } = require("nodemon");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const User = require("../../model/User");

// @ route get api/users
// @ desc test route 
// @ access Public
router.post("/",[
    check("name", "name is required")
    .not()
    .isEmpty(),
    check("email","please include a valid emial").isEmail(),
    check(
        "password",
        "please enter a password with 6 or more character"
    ).isLength({ min: 6})
],
    async (req, res) =>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {name, email, password} = req.body;
   
    try{
 // see if user exits
        let user = await User.findOne({ email: email});

        if(user){
            res.status(400).json({errors: [{msg: "user already exists"}]})
        }


    
    const avatar = gravatar.url(email,{
        s: "200",
        r: "pg",
        d: "mm"
    });

    user = new User({
        name, 
        email,
        avatar,
        password
    });

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();


    // Return JsonWebToken
    res.send("user route");


    }
    catch(err){
        console.log(err.message);
        res.status(500).send("server error");
    }
    





    res.send("user routes");
})

module.exports = router;