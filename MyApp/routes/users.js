var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", (req, res) => {
  req.db
    .collection("users")
    .find({})
    .toArray((err, data) => {
      if (err) throw err;
      res.json(data);
    });
});

module.exports = router;
