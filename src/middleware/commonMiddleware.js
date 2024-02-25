const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    console.log('Common middleware executed');
  next();
});

module.exports = router;
