const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Menu route');
});

module.exports = router; 
