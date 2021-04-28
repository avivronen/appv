const express = require('express');
const router  = express.Router();
const fbController = require('../controllers/fb');

router.get('/topPosts/:access_token', fbController.topPosts);

module.exports = router;