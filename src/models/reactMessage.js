import mongoose from 'mongoose';

const reactMessageSchema = new mongoose.Schema(
	{
		messageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Message',
			required: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		emoji: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const reactMessage = mongoose.model('ReactMessage', reactMessageSchema);

export default reactMessage;
