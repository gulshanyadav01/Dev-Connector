const express = require("express");

const router = express.Router();

// @ route get api/post
// @ desc test route 
// @ access Public
router.get("/",(req, res) =>{
    res.send("post routes");
})

module.exports = router;