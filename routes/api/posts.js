const express = require('express');
const router = express.Router();

// Get ROute api/
// main Route
// Public route

router.get('/', (req,res)=>{
    res.send('Post Route');
})

module.exports = router;