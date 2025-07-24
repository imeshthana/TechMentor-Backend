const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");

const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    const user = await UserModel.findOne({ username });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const passwordMatched = await bcrypt.compare(password, user.passwordHash);

    if (passwordMatched == false) {
      console.log("Password doesn't match");
      return res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    }

    console.log("Password matched");

    const accessToken = await jwt.sign(
      { id: user.id, role: user.role, name: user.username },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = await jwt.sign(
      { id: user.id, role: user.role, name: user.username },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);

    user.refresh = refreshToken;
    await user.save();

    res.status(200).json({
      status: "Success",
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
      role: user.role,
      user: {
        id: user._id,
        name: user.fullname,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const { id, token } = req.body;

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "Token is required",
      });
    }

    if (user.refresh !== token) {
      return res.status(403).json({
        status: "error",
        message: "Invalid token",
      });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role, name: user.username },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      token: newAccessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

const register = async (req, res, next) => {
  try {
    const { fullname, username, email, phone, password, role } = req.body;
    console.log(req.body);

    if (!password || !email || !phone || !username || !fullname || !role) {
      console.log("Required fields incomplete");
      return res.status(400).json({
        status: "error",
        message: "Student creating unsuccessful",
      });
    }
    if (role !== "student" && role !== "instructor") {
      console.log("Invalid role");
      return res.status(400).json({
        status: "error",
        message: "Invalid role",
      });
    }

    const user = await UserModel.findOne({
      $or: [{ username }],
    });

    if (user) {
      console.log("User already exists");
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({
      fullname,
      email,
      phone,
      username,
      role,
      passwordHash: hashedPassword,
    });

    const savedUser = await newUser.save();

    console.log("User created successfully");
    console.log(savedUser);

    if (savedUser) {
      res.status(200).json({
        status: "Success",
        message: "Registration successful",
        user: {
          id: savedUser._id,
          name: savedUser.fullname,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

const getProfile = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await UserModel.findById(id);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Profile found successfully",
      user: {
        fullname: user.fullname,
        email: user.email,
        courses: user.courses,
        phone: user.phone,
        role: user.role,
        id: user._id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error occured",
    });
  }
};

module.exports = {
  signin,
  register,
  refreshAccessToken,
  getProfile,
};
