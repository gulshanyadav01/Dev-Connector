const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator"); 

const User = require("../../model/User")

// @ route get api/auth
// @ desc test route 
// @ access Public
router.get("/", auth , async(req, res) =>{
    try{
        const user =  (await User.findById(req.user.id)).isSelected("-password");
        res.json(user);

    }
    catch(err){
        console.error(err.message);
    }
    res.send("auth routes");
})


// @route  post api/auth
// @desc Authenticate user & get token 
// @access Public


router.post("/",[

    check("email","please include a valid emial").isEmail(),
    check(
        "password",
        "password is required"
    ).exists()
],
    async (req, res) =>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
   
    try{
 // see if user exits
        let user = await User.findOne({ email: email});

        if(!user){
            res.status(400).json({errors: [{msg: "invalid credentials"}]})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return res
            .status(400)
            .json({errors : [{ msg: "invalid Credentials "}]});
        }


    const payLoad ={
        user: {
            id: user.id
        }
    }
    jwt.sign(
        payLoad, 
        config.get("jwtSecret"),
        {expiresIn:360000},
        (err, token) =>{
            if(err) throw err;
            res.json({ token });

    });
}catch(err){
        console.log(err.message);
        res.status(500).send("server error");
    }
    





    res.send("user routes");
})



module.exports = router;