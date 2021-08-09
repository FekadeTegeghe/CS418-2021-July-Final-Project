var express = require("express");
var router = express.Router();

router.get("/products", (req, res) => {
  req.db
    .collection("products")
    .find({})
    .toArray((err, data) => {
      if (err) throw err;
      res.json(data);
    });
});
router.get("/products/:productName", (req, res) => {
  req.db
    .collection("products")
    .findOne({ productName: req.params.productName }, (err, data) => {
      if (err) throw err;
      res.json(data);
    });
});
router.post("/products", (req, res) => {
  req.db.collection("products").insert(req.body, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});
router.delete("/products/:productName", (req, res) => {
  req.db
    .collection("products")
    .remove({ productName: req.params.productName }, (err, data) => {
      if (err) throw err;
      res.json(data);
    });
});
// router.update("/products/:productName", (req, res) => {
//   req.db
//     .collection("products")
//     .update(
//       { productName: req.params.productName },
//       { $set: { productName: req.body.productName, price: req.body.price } },
//       (err, data) => {
//         if (err) throw err;
//         res.json(data);
//       }
//     );
// });

module.exports = router;
