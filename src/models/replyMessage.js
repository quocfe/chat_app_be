import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		messageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Message',
			required: true,
		},
		replyMessage: {
			type: String,
			required: true,
		},
		oldMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Message',
			required: true,
		},
		unSend: {
			type: mongoose.Schema.Types.Array,
		},
		statusUnSend: { type: String, default: ' ' },
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const ReplyMessage = mongoose.model('ReplyMessage', messageSchema);

export default ReplyMessage;
