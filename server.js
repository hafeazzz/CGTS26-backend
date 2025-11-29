require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.post("/send-ticket", async (req, res) => {
    const { email, name, event, code } = req.body;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `E-Ticket Registration - ${event}`,
            text: `
Hello ${name},

Thank you for registering for our event.

Your ticket code:
${code}

See you at the event!
            `,
        });

        res.json({ success: true, message: "Ticket email sent!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

app.listen(5000, () => {
    console.log("Backend server running on port 5000");
});
