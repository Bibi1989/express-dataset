const express = require("express");
const router = express.Router();
const getAllActors = require("../controllers/actors").getAllActors;

// Routes related to actor.

router.get("/", (req, res) => {
  getAllActors(res);
});

module.exports = router;
