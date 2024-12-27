import mongoose from 'mongoose';

const connect = async () => {
	const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.vwhdn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
	try {
		await mongoose.connect(uri);
		console.log('connect mongodb');
	} catch (error) {
		console.log('disconnect mongodb');
	}
};

export default connect;
