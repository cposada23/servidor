const express  = require('express');
const authCtrl = require('./controllers/auth.ctrl');

const router = express.Router();

router.use('/facebook' , authCtrl.facebookAuth, authCtrl.retrieveUser, authCtrl.generateToken, (req, res) => {
    console.log("Todo correcto devolviendo la token en auth index.js");
    res.json({token: req.generatedToken});
});

router.use('/login', authCtrl.localAuth , authCtrl.generateToken, (req, res)=>{
    res.json({token: req.generatedToken});
});

module.exports = router;