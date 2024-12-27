import express from 'express';
import AuthControllers from '../controllers/AuthControllers.js';

const router = express.Router();

router.post('/signup', AuthControllers.signup);
router.post('/login', AuthControllers.login);
router.post('/logout', AuthControllers.logout);

export default router;
