const express  = require('express');
const authCtrl = require('./controllers/auth.ctrl');

const router = express.Router();
/**
 * Social auth
 */
router.use('/facebook' , authCtrl.facebookAuth, authCtrl.retrieveUser, authCtrl.generateToken, (req, res) => {
    res.json({token: req.generatedToken});
});


/**
 * local Auth
 * local SingUp
 */
router.use('/login', authCtrl.localAuth, authCtrl.generateToken, (req, res)=>{
    res.json({token: req.generatedToken});
});

router.use('/signup', authCtrl.localsingup, authCtrl.generateToken,(req, res)=>{
    res.json({token: req.generatedToken});
});

/**
 * recuperar contraseña
 */
router.use('/forgot', authCtrl.forgot);
router.use('/reset', authCtrl.reset);


module.exports = router;