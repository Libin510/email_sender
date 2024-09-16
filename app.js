const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/", async (req, res) => {
  const { email, name, message } = req.query;

  const mailOptionsToMe = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission from ${name}`,
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
  };

  const mailOptionsToSender = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank you for contacting us!",
    text: `Hello ${name},\n\nThank you for reaching out! I have received your message. I will get back to you as soon as possible.\n\nBest regards,\nLibin Thomas\n(libinprofile@gmail.com)`,
  };

  try {
    await transporter.sendMail(mailOptionsToMe);
    console.log("Email sent to self");

    await transporter.sendMail(mailOptionsToSender);
    console.log("Automated reply sent");

    res.status(200).json({
      message: "Your message has been sent successfully. I will contact you soon!",
    });
  } catch (error) {
    console.log("Error sending email:", error);
    res.status(500).json({
      message: "Failed to send email. Please try again later.",
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
