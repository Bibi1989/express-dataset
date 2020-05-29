const express = require("express");
const router = express.Router();
const addEvent = require("../controllers/events").addEvent;
const getAllEvents = require("../controllers/events").getAllEvents;
const getByActor = require("../controllers/events").getByActor;

// Routes related to event
router.get("/", getAllEvents);

router.get("/actors/:actor_id", getByActor);

router.post("/", addEvent);

module.exports = router;
