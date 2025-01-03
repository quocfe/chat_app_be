import authRoutes from './auth.js';
import messageRoutes from './message.js';
import replymessageRoutes from './replymessage.js';
import reactMessageRoutes from './reactMessage.js';
import userRoutes from './user.js';

function route(app) {
	app.use('/api/auth', authRoutes);
	app.use('/api/message', messageRoutes);
	app.use('/api/replymessage', replymessageRoutes);
	app.use('/api/reactmessage', reactMessageRoutes);
	app.use('/api/users', userRoutes);
	app.use('/', (req, res) => {
		res.status(200).json('Hello world');
	});
}

export default route;
