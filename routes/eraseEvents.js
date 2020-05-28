var express = require("express");
var router = express.Router();
const eraseEvents = require("../controllers/events").eraseEvents;

// Route related to delete events
router.delete("/", (_req, res) => {
  eraseEvents(res);
});

module.exports = router;
