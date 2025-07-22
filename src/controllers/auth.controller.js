const jwt = require("jsonwebtoken");
const StudentModel = require("../models/student.model");
const AdminModel = require("../models/admin.model");
const bcrypt = require("bcrypt");

const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    const admin = await AdminModel.findOne({ username });
    const student = await StudentModel.findOne({ username });

    const user = admin || student;

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const passwordMatched = await bcrypt.compare(password, admin.passwordHash);

    if (passwordMatched == false) {
      console.log("Password doesn't match");
      return res.status(401).json({
        status: "error",
        message: "Invalid password",
      });
    }

    console.log("Password matched");

    const accessToken = await jwt.sign(
      admin.toJSON(),
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    console.log("accessToken", accessToken);

    res.status(200).json({
      status: "Success",
      message: "Login successful",
      token: accessToken,
      role: admin ? "admin" : "student",
      user: {
        id: user._id,
        username: user.username,
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

const studentsignup = async (req, res, next) => {
  try {
    const { fullName, username, email, phone, password } = req.body;
    console.log(req.body);

    if (!password || !email || !phone || !username || !fullName) {
      console.log("Required fields incomplete");
      return res.status(400).json({
        status: "error",
        message: "Admin creating unsuccessful",
      });
    }

    const student = await StudentModel.findOne({
      $or: [{ username }],
    });

    if (student) {
      console.log("User already exists");
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newStudent = new StudentModel({
      fullName,
      email,
      phone,
      username,
      passwordHash: hashedPassword,
    });

    const savedStudent = await newStudent.save();

    console.log("Student created successfully");
    console.log(savedStudent);

    if (savedStudent) {
      res.status(200).json({
        status: "Success",
        message: "Student created successfully",
        student: {
          id: savedStudent._id,
          email: savedStudent.email,
          fullName: savedStudent.fullName,
          phone: savedStudent.phone,
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

const adminsignup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    if (!password || !username) {
      console.log("Required fields incomplete");
      return res.status(400).json({
        status: "error",
        message: "Admin creating unsuccessful",
      });
    }
    const admin = await AdminModel.findOne({
      $or: [{ username }],
    });
    if (admin) {
      console.log("Admin already exists");
      return res.status(400).json({
        status: "error",
        message: "Admin already exists",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = new AdminModel({
      username,
      passwordHash: hashedPassword,
    });
    const savedAdmin = await newAdmin.save();
    console.log("Admin created successfully");

    console.log(savedAdmin);
    if (savedAdmin) {
      res.status(200).json({
        status: "Success",
        message: "Admin created successfully",
        admin: {
          id: savedAdmin._id,
          username: savedAdmin.username,
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

module.exports = {
  signin,
  studentsignup,
  adminsignup,
};
