const express  = require('express');
const authCtrl = require('./controllers/auth.ctrl');

const router = express.Router();

router.use('/facebook' , authCtrl.facebookAuth, authCtrl.retrieveUser, authCtrl.generateToken, (req, res) => {
    res.json({token: req.genertedToken});
});

module.exports = router;