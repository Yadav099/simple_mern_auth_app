const express = require("express");
const router = express.Router();

//Item model
const Item = require("../../Models/Item");

// @route GET api/items
// @desc get all items
// @access Public

router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((items) => res.json(items))
    .catch((err) => console.log(err));
});

// @route POST api/items
// @desc post a items
// @access Public

router.post("/", (req, res) => {
  const newItem = new Item({
    name: req.body.name,
  });
  newItem
    .save()
    .then((item) => res.json(item))
    .catch((err) => res.json(err));
});

// @route DELETE api/items
// @desc delete a items
// @access Public

router.delete("/:id", (req, res) => {
  Item.findByIdAndDelete(req.params.id).then((item) =>
    res.json(item).catch((err) => res.status(404).json(err))
  );
});

module.exports = router;
