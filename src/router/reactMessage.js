import express from 'express';
import ReactMessageControllers from '../controllers/ReactMessageControllers.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('', protectRoute, ReactMessageControllers.getEmojisByMessageId);
router.delete('/:id', protectRoute, ReactMessageControllers.deleteReactMessage);
router.put('/:id', protectRoute, ReactMessageControllers.updateReactMessage);
router.post(
	'/send/:id',
	protectRoute,
	ReactMessageControllers.sendReactMessage
);

export default router;
