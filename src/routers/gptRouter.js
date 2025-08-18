const express = require("express");
const router = express.Router();

const GPTController = require("../controllers/gpt");
const { asyncHandler } = require("../utils/helpers");

router.post("/", asyncHandler(GPTController.question));

module.exports = router;
