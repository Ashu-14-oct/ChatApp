const express = require('express');
const router = express.Router();
const mainController = require('../controller/main_controller');
const passport = require('passport');

router.get('/', mainController.home);
router.get('/user/sign-up', mainController.signUp);
router.post('/create-user', mainController.createUser);
router.get('/user/sign-out', mainController.signOut);
//using passport for auth
router.post('/create-session', passport.authenticate('local', {failureRedirect: '/'}) ,mainController.signIn);

module.exports = router;