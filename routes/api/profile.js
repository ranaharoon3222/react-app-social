const express = require('express');
const router = express.Router();

// Get ROute api/
// main Route
// Public route

router.get('/', (req,res)=>{
    res.send('Profile Route');
})

module.exports = router;