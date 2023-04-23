const router = require("express").Router();

const authenticateUser = require("../middlewares/authenticateUser");
const checkRole = require("../middlewares/checkRole");
const roles = require("../constants/roles");
const {
  createConference,
  getMyConferences,
  getAllConferences,
  updateConferenceDetails,
  joinConference,
} = require("../controllers/conferences");

router.post(
  "/create",
  authenticateUser,
  checkRole(roles.MANAGER),
  createConference
);
router.get(
  "/my-conferences",
  authenticateUser,
  checkRole(roles.MANAGER),
  getMyConferences
);
router.get("/all", authenticateUser, getAllConferences);
router.put(
  "/update/:id",
  authenticateUser,
  checkRole(roles.MANAGER),
  updateConferenceDetails
);
router.post("/joinConference/:conferenceId", authenticateUser, joinConference);

module.exports = router;
