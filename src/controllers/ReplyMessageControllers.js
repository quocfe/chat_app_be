import Message from '../models/message.js';
import Conversation from '../models/conversation.js';
import {
	getReceiverSocketId,
	getSenderSocketId,
	io,
} from '../socket/socket.js';
import ReplyMessage from '../models/replyMessage.js';

const ReplyMessageControllers = {
	async sendReplyMessage(req, res, next) {
		try {
			const { replyMessage, receiverId } = req.body;
			const { id: messageId } = req.params;
			const senderId = req.user._id;

			const oldMessage = await Message.findById(messageId);

			if (!oldMessage)
				return res
					.status(500)
					.json('Can not find old message in replycontroller');

			const replymessage = new ReplyMessage({
				receiverId,
				senderId,
				messageId,
				replyMessage,
				oldMessage,
			});

			await replymessage.save();

			const senderSocketId = getSenderSocketId(senderId);
			const receiverSocketId = getReceiverSocketId(receiverId);

			if (receiverSocketId) {
				console.log('receiverSocketId', receiverSocketId);

				io.to(receiverSocketId).emit('newReplyMessage', replymessage);
			}

			if (senderSocketId) {
				console.log('senderSocketId ', senderSocketId);

				io.to(senderSocketId).emit('newReplyMessage', replymessage);
			}

			res.status(201).json(replymessage);
		} catch (error) {
			console.log('Error in replymessage controller', error.message);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	async getReplyMessage(req, res, next) {
		try {
			const replyMessage = await ReplyMessage.find();

			if (!replyMessage) return res.status(200).json([]);

			res.status(200).json(replyMessage);
		} catch (error) {
			console.log('Error in getReplyMessage controller: ', error.message);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
};

export default ReplyMessageControllers;
