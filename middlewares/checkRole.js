const checkRole = (role) => {
  return (req, res, next) => {
    // console.log("the log", req.user, role);
    try {
      if (req.userId && req.role === role) {
        next();
      } else {
        res.status(403).json({ message: "Forbidden: Insufficient Role" });
      }
    } catch (err) {
      console.log(err);
    }
  };
};

module.exports = checkRole;
