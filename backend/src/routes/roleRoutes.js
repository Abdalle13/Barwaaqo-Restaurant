const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Role route');
});

module.exports = router; 
