const { ForbiddenError } = require("../error");

const hasRole = (roles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      throw new ForbiddenError("Ruhsat yo'q");
    }

    next();return res.status(403).json({
      error: "Ruxsat berilmagan.",
    });
  };
};

module.exports = hasRole;
