const express = require('express');
const router = express.Router();

router.get('/users', (req, res)=>{
    res.send('Users Page');
});

module.exports = router;