import express from 'express';
import protectRoute from '../middlewares/protectRoute.js';
import ReplyMessageControllers from '../controllers/ReplyMessageControllers.js';

const router = express.Router();

router.get('/', ReplyMessageControllers.getReplyMessage);
router.post(
	'/reply/:id',
	protectRoute,
	ReplyMessageControllers.sendReplyMessage
);

export default router;
