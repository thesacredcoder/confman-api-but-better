const { signUp, signIn, verifyMail, logout } = require("../controllers/users");

const router = require("express").Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.delete("/logout", logout);
router.get("/verify", verifyMail);

module.exports = router;
