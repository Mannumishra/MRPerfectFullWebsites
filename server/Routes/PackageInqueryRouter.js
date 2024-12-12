const { createInquiry, getInquiries, verifyPayment, deleteInquiries, } = require("../Controllar/PackageInqueryControllar")

const PackageInquery = require("express").Router()

PackageInquery.post("/package-inquery", createInquiry)
PackageInquery.get("/package-inquery", getInquiries)
PackageInquery.delete("/delete-package-inquery/:id", deleteInquiries)
PackageInquery.post("/verify-payment", verifyPayment)

module.exports = PackageInquery