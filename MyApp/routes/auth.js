const express = require("express");
const path = require("path");
const router = express.Router();
const jwtManager = require("../jwt");

//login method
router.post("/", (req, res, next) => {
  const cred = req.db.collection("users").findOne({
    $and: [{ userName: req.body.userName }, { password: req.body.password }],
  });
  console.log(cred);
  //db/fs find email and password in the database
  if (cred) {
    const data = {};
    data.userName = req.body.userName;
    data.createdAt = Date.now();
    data.role = "basic";
    const token = jwtManager.generate(data);
    res.json({ result: token, status: "success" });
  } else {
    res.json({ status: "invalid_user" });
  }
});

module.exports = router;
