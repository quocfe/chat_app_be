import express from 'express';
import MessageControllers from './../controllers/MessageControllers.js';
import protectRoute from './../middlewares/protectRoute.js';

const router = express.Router();

router.get('/:id', protectRoute, MessageControllers.getMessage);
router.post('/send/:id', protectRoute, MessageControllers.sendMessage);
router.post('/unSend/:id', protectRoute, MessageControllers.unSendMessage);

export default router;
