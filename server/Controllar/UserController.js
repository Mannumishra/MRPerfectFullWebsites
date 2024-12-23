const User = require("../Model/UserModel");
const { transporter } = require("../Utils/Nodemailer");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


// Email template function
const getSignupEmailTemplate = (user) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MR AND MRS PERFECT TRIP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #C5733C;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      text-align: left;
    }
    .footer {
      background-color: #f1f1f1;
      text-align: center;
      padding: 10px;
      font-size: 14px;
      color: #666;
    }
    .button {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      background-color: #C5733C;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Welcome to MR AND MRS PERFECT TRIP
    </div>
    <div class="content">
      <p>Dear ${user.name},</p>
      <p>Thank you for signing up with <strong>MR AND MRS PERFECT TRIP</strong>.</p>
      <p>
        We specialize in creating unforgettable local and international travel experiences. Explore the best packages tailored for your perfect trips!
      </p>
      <p>Feel free to reach out to us for any assistance.</p>
      <p><a href="#" class="button">Explore Packages</a></p>
    </div>
    <div class="footer">
      <p>Contact Us: 9699862917 | mrandmrsperfecttrips@gmail.com</p>
      <p>© ${new Date().getFullYear()} MR AND MRS PERFECT TRIP. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Signup Controller
const signupUser = async (req, res) => {
    try {
        const { name, email, number, password } = req.body;
        console.log(req.body)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashPass = await bcrypt.hash(password, saltRounds)
        // Create new user
        const newUser = new User({ name, email, number, password: hashPass });
        await newUser.save();

        // Send signup email
        const mailOptions = {
            from: 'mannu22072000@gmail.com',
            to: newUser.email,
            subject: "Welcome to MR AND MRS PERFECT TRIP!",
            html: getSignupEmailTemplate(newUser)
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Signup successful! Confirmation email sent." });
    } catch (error) {
        console.error("Error in signup process:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getUserRecords = async (req, res) => {
    try {
        const data = await User.find()
        return res.status(200).json({
            success: true,
            message: "User Record Found Successfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error." });
    }
}

const getUserRecord = async (req, res) => {
    try {
        const data = await User.findById(req.params.id)
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User Record not found",
                data: data
            })
        }
        return res.status(200).json({
            success: true,
            message: "User Record Found Successfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error." });
    }
}

const login = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body
        const userData = await User.findOne({ email: email })
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "Invaild User id"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(404).json({
                success: false,
                message: "Invaild Password"
            })
        }

        const jwtKey = userData.role === "Admin"
            ? process.env.JWTKEY_ADMIN
            : process.env.JWT_KEY_USER;

        const token = jwt.sign({ userId: userData._id, userName: userData.name, role: userData.role }, jwtKey, { expiresIn: "1d" })
        // Save token in cookies
        res.cookie("auth_token", token, {
            httpOnly: true,         // Prevents JavaScript access to the cookie
            secure: false,          // `false` because you're working locally
            sameSite: "strict",     // Protects against CSRF
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });

        // res.cookie("auth_token", token, {
        //     httpOnly: true,          // Prevents JavaScript access to the cookie
        //     secure: true,            // Ensures cookies are sent over HTTPS only
        //     sameSite: "strict",      // Protects against CSRF
        //     maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        // });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: userData,
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server errro"
        })
    }
}

module.exports = {
    signupUser, login, getUserRecords, getUserRecord
};
