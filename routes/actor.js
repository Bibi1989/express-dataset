const express = require("express");
const router = express.Router();
const getAllActors = require("../controllers/actors").getAllActors;
const updateActor = require("../controllers/actors").updateActor;
const getStreak = require("../controllers/actors").getStreak;

// Routes related to actor.

router.get("/", getAllActors);

router.get("/streak", getStreak);

router.put("/", updateActor);

module.exports = router;
