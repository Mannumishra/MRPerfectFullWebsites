const { signupUser, login, getUserRecords, getUserRecord } = require("../Controllar/UserController")

const SignupRouter = require("express").Router()


SignupRouter.post("/sign-up", signupUser)
SignupRouter.get("/all-sign-up", getUserRecords)
SignupRouter.get("/single-sign-up/:id", getUserRecord)



SignupRouter.post("/login", login)

module.exports = SignupRouter