const express = require("express");
const router = express.Router();
const addEvent = require("../controllers/events").addEvent;
const getAllEvents = require("../controllers/events").getAllEvents;

// Routes related to event
router.get("/", (req, res) => {
  getAllEvents(res);
});

router.post("/", async (req, res) => {
  const event = await addEvent(req.body);
  res.json({ event });
});

module.exports = router;
