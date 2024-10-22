const express = require("express");
const { ownerRegister } = require("../controllers/ownerController");
const router = express.Router();


router.get("/", (req, res) => {
    res.send("owner Router");
});

router.post("/register", ownerRegister);

module.exports = router;
