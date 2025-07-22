const jwt = require("jsonwebtoken");
const StudentModel = require("../models/student.model");
const AdminModel = require("../models/instructor.model");
const bcrypt = require("bcrypt");
const InstructorModel = require("../models/instructor.model");

const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    const instructor = await InstructorModel.findOne({ username });
    const student = await StudentModel.findOne({ username });

    const user = instructor || student;

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
      user.toJSON(),
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    console.log("accessToken", accessToken);

    res.status(200).json({
      status: "Success",
      message: "Login successful",
      token: accessToken,
      role: instructor != null ? "instructor" : "student",
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
    const { fullname, username, email, phone, password } = req.body;
    console.log(req.body);

    if (!password || !email || !phone || !username || !fullname) {
      console.log("Required fields incomplete");
      return res.status(400).json({
        status: "error",
        message: "Student creating unsuccessful",
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
      fullname,
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
          fullname: savedStudent.fullname,
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

const instructorSignup = async (req, res, next) => {
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
    const instructor = await InstructorModel.findOne({
      $or: [{ username }],
    });
    if (instructor) {
      console.log("Admin already exists");
      return res.status(400).json({
        status: "error",
        message: "Admin already exists",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newInstructor = new InstructorModel({
      username,
      passwordHash: hashedPassword,
    });
    const savedInstructor = await newInstructor.save();
    console.log("Instructor created successfully");

    console.log(savedInstructor);
    if (savedInstructor) {
      res.status(200).json({
        status: "Success",
        message: "Instructor created successfully",
        instructor: {
          id: savedInstructor._id,
          username: savedInstructor.username,
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
  instructorSignup
};
