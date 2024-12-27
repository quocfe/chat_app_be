import Message from './../models/message.js';
import Conversation from './../models/conversation.js';
import ReplyMessage from '../models/replyMessage.js';
import {
	getReceiverSocketId,
	getSenderSocketId,
	io,
	userSocketMap,
} from '../socket/socket.js';

const MessageControllers = {
	async sendMessage(req, res, next) {
		try {
			const { message } = req.body;
			const { id: receiverId } = req.params;
			const senderId = req.user._id;

			let conversation = await Conversation.findOne({
				participants: { $all: [senderId, receiverId] },
			});

			if (!conversation) {
				conversation = await Conversation.create({
					participants: [senderId, receiverId],
				});
			}

			const newMessage = new Message({
				senderId,
				receiverId,
				message,
			});

			if (newMessage) {
				conversation.messages.push(newMessage._id);
			}
			await Promise.all([conversation.save(), newMessage.save()]);

			const receiverSocketId = getReceiverSocketId(receiverId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit('newMessage', newMessage);
			}

			const senderSocketId = getSenderSocketId(senderId);
			console.log('senderSocketId', senderSocketId);
			if (senderSocketId) {
				io.to(senderSocketId).emit('newMessage', newMessage);
			}

			res.status(201).json(newMessage);
		} catch (error) {
			console.log('Error in message controller', error.message);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	},

	async getMessage(req, res, next) {
		try {
			const { id: userToChatId } = req.params;
			const senderId = req.user._id;

			const conversation = await Conversation.findOne({
				participants: { $all: [senderId, userToChatId] },
			})
				.populate('messages')
				.populate('replymessages');

			if (!conversation) return res.status(200).json([]);
			const messages = conversation.messages;
			const replyMessages = await ReplyMessage.find();

			const updatedMessages = messages
				.map((message) => {
					const replyMessage = replyMessages.find(
						(reply) => String(message._id) === String(reply.oldMessage)
					);
					if (replyMessage) {
						return [message, replyMessage];
					}
					return message;
				})
				.flat();

			updatedMessages.sort((a, b) => {
				const timeA = a.createdAt || a.timestamp || 0;
				const timeB = b.createdAt || b.timestamp || 0;
				return timeA - timeB;
			});
			res.status(200).json(updatedMessages);
		} catch (error) {
			console.log('Error in getMessages controller: ', error.message);
			res.status(500).json({ error: 'Internal server error' });
		}
	},

	async unSendMessage(req, res, next) {
		try {
			const messageId = req.params.id;
			const message = await Message.findById(messageId);
			const senderId = req.user._id;
			const statusUnSend = req.body.statusUnSend;
			// Kiểm tra xem người gửi tin nhắn có phải là người đang yêu cầu gỡ không
			if (message) {
				// Đặt trạng thái gỡ tin nhắn thành true
				message.unSend.push(req.user._id);
				message.statusUnSend = statusUnSend;
				await message.save();

				const senderSocketId = getSenderSocketId(senderId);
				if (senderSocketId) {
					io.to(senderSocketId).emit('newMessage', message);
				}

				const [receiver] = Object.keys(userSocketMap).filter(
					(key) => key != senderId
				);
				const receiverSocketId = getReceiverSocketId(receiver);

				if (receiverSocketId) {
					io.to(receiverSocketId).emit('newMessage', message);
				}

				res.status(201).json(message);
			} else {
				res.status(403).json({
					success: false,
					message: 'Bạn không có quyền gỡ tin nhắn này.',
				});
			}
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ success: false, message: 'Đã xảy ra lỗi khi gỡ tin nhắn.' });
		}
	},
};

export default MessageControllers;
