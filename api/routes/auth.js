import express from 'express';
import { login, register, logout } from '../controllers/authController.js';
import { check } from 'express-validator';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth route');
});

router.post('/register', [
  check('userName', 'Please enter a valid name').not().isEmpty(),
  check('userName', 'Please enter a valid name').isAlphanumeric,
  check('userName', 'Please enter a valid name').isString,
  check('userName', 'Please enter a name with min. 3 characters').isLength({
    min: 3}),
  check('userName', 'Please enter a name with max. 15 characters').isLength({
    max: 15}),

  check('email', 'Please enter a valid email').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a valid password').isLength({
    min: 3
  })
], register);

router.post('/login', login);
router.post('/logout', logout);



export default router;
