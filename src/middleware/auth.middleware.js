const jwt = require("jsonwebtoken");

const authenticateAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      console.log("Unauthorized");
      return res.status(403).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    console.log(token);

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          status: "error",
          message: "Unauthorized",
        });
      }
      console.log("Authorized");
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

module.exports = authenticateAuth;
