import express from 'express';
import { login, register, logout } from '../controllers/authController.js';
import { check, validationResult } from 'express-validator';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth route');
});

router.post('/register',
  [
    check('userName', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 3 or more characters').isLength({ min: 3 }),
    check('confirmPassword', 'Please enter a password with 3 or more characters').isLength({ min: 3 })
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    register(req, res);
  }
);

router.post('/login', login);
router.post('/logout', logout);



export default router;
