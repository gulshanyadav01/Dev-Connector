const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../model/Profile");
const {check , validationResult } = require("express-validator");
const { ValidationHalt } = require("express-validator/src/base");

// @ route get api/profile/me 
// @ desc get current uses profile 
// @ access Public

router.get("/me",auth, async(req, res) =>{

    try{
        const profile =  (await Profile.findOne({ user: req.user.id })).populate("user",
        ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: "there is no profile for this user"});
        }
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("server Error");
    }

    
})

// @ route   Post api/profile
// @desc  create or update user profile
// @access 

router.post("/", [auth, [
    check("status","status is required")
    .not()
    .isEmpty(),
    check("skills", "skills is required")
    .not()
    .isEmpty()
]
],
    async( req, res) => {
        const errors = ValidationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array() });
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin 
        } = req.body;
        // build profile object 

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
        
    }
)

module.exports = router;