const router = require("express").Router();
const multer = require("multer");

const authenticateUser = require("../middlewares/authenticateUser");
const { uploadPaper } = require("../controllers/papers");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

router.post("/upload", authenticateUser, upload.single("paper"), uploadPaper);

module.exports = router;
