import reactMessage from '../models/reactMessage.js';
import {
	getReceiverSocketId,
	getSenderSocketId,
	io,
	userSocketMap,
} from '../socket/socket.js';

const ReactMessageControllers = {
	async sendReactMessage(req, res, next) {
		try {
			const { emoji } = req.body;
			const { id: messageId } = req.params;
			const senderId = req.user._id;

			const newReactMessage = new reactMessage({
				messageId,
				senderId,
				emoji,
			});

			await newReactMessage.save();

			const senderSocketId = getSenderSocketId(senderId);
			if (senderSocketId) {
				io.to(senderSocketId).emit('newReactMessage', newReactMessage);
			}

			const [receiver] = Object.keys(userSocketMap).filter(
				(key) => key != senderId
			);
			const receiverSocketId = getReceiverSocketId(receiver);

			if (receiverSocketId) {
				io.to(receiverSocketId).emit('newReactMessage', newReactMessage);
			}

			res.status(200).json(newReactMessage);
		} catch (error) {
			console.log('Error in reactmessage controller', error.message);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	async getEmojisByMessageId(req, res, next) {
		try {
			const data = await reactMessage.find();

			res.status(200).json(data);
		} catch (error) {
			console.log('Error in getting emojis by message ID: ', error.message);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	async updateReactMessage(req, res, next) {
		try {
			const { id: reactMessageId } = req.params;
			const { emoji } = req.body;
			const senderId = req.user._id;

			const updatedReactMessage = await reactMessage.findByIdAndUpdate(
				reactMessageId,
				{ emoji },
				{ new: true }
			);

			const senderSocketId = getSenderSocketId(senderId);
			if (senderSocketId) {
				io.to(senderSocketId).emit('newReactMessage', updatedReactMessage);
			}

			const [receiver] = Object.keys(userSocketMap).filter(
				(key) => key != senderId
			);
			const receiverSocketId = getReceiverSocketId(receiver);

			if (receiverSocketId) {
				io.to(receiverSocketId).emit('newReactMessage', updatedReactMessage);
			}

			res.status(200).json(updatedReactMessage);
		} catch (error) {
			console.log('Error in updating react message: ', error.message);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	async deleteReactMessage(req, res, next) {
		try {
			const { id: reactMessageId } = req.params;
			const senderId = req.user._id;

			const deleteReactMessage = await reactMessage.findByIdAndDelete(
				reactMessageId
			);
			const senderSocketId = getSenderSocketId(senderId);
			if (senderSocketId) {
				io.to(senderSocketId).emit('newReactMessage', deleteReactMessage);
			}

			const [receiver] = Object.keys(userSocketMap).filter(
				(key) => key != senderId
			);
			const receiverSocketId = getReceiverSocketId(receiver);

			if (receiverSocketId) {
				io.to(receiverSocketId).emit('newReactMessage', deleteReactMessage);
			}
			res.status(200).json({ message: 'React message deleted successfully' });
		} catch (error) {
			console.log('Error in deleting react message: ', error.message);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},
};

export default ReactMessageControllers;
