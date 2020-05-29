var express = require("express");
var router = express.Router();
const eraseEvents = require("../controllers/events").eraseEvents;

// Route related to delete events
router.delete("/", eraseEvents);

module.exports = router;
