const express = require("express");

const router = express.Router();

// @ route get api/auth
// @ desc test route 
// @ access Public
router.get("/",(req, res) =>{
    res.send("auth routes");
})

module.exports = router;