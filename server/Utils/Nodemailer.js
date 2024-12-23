const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mannu22072000@gmail.com",
        pass: "txem gstj pfqo vqlh"
    }
})


module.exports = { transporter }