import express from 'express';
import protectRoute from './../middlewares/protectRoute.js';
import UserController from './../controllers/UserControllers.js';

const router = express.Router();

router.get('/:id', protectRoute, UserController.getUserById);
router.get('/', protectRoute, UserController.getUsersForSidebar);

export default router;
