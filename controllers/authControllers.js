const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Course = require("../models/Course");
//user oluşturma
exports.createUser = async (req, res, next) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

//giriş yapma
exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User not found!" });

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return res.status(401).json({ error: "Wrong password or username!" });

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    const { password, ...otherDetails } = user._doc;
    res
      .cookie("access_token", accessToken, { httpOnly: true, secure: false })
      .status(200)
      .json({ ...otherDetails, accessToken });
  } catch (error) {
    next(error);
  }
};

//dashboard
exports.dashboard = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const test = decoded.id;
    const user = await User.findById(decoded.id)
      .populate("courses")
      .select("courses");
    const courses = await Course.find({ user: test });
    res.status(200).json({ courses, user });
  } catch (error) {
    next(error);
  }
};

//email gönder

exports.sendMail = async (req, res, next) => {
  // Bir test hesabı oluşturun
  let testAccount = await nodemailer.createTestAccount();

  // Yapılandırma
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "keeley38@ethereal.email",
      pass: "4ZRrdmNDYvRgdqx5Rq",
    },
  });

  // Alıcı e-posta adresleri ve konu
  let mailOptions = {
    from: req.body.email,
    to: req.body.email,
    subject: req.body.subject,
    text: req.body.message,
  };

  // E-posta gönderme
  let info = await transporter.sendMail(mailOptions);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.status(200).json({ message: "Email sent!" });
};
