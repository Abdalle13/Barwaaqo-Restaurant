const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Permission route');
});

module.exports = router; 