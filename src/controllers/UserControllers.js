import User from './../models/user.js';

const UserController = {
	async getUsersForSidebar(req, res) {
		try {
			const loggedInUserId = req.user._id;

			const filteredUsers = await User.find({
				_id: { $ne: loggedInUserId },
				// $ne: not equal
			}).select('-password');

			res.status(200).json(filteredUsers);
		} catch (error) {
			console.error('Error in getUsersForSidebar: ', error.message);
			res.status(500).json({ error: 'Internal server error' });
		}
	},

	async getUserById(req, res) {
		try {
			const user = await User.findById(req.params.id);
			res.status(200).json(user);
		} catch (error) {
			console.error('Error in getUserById: ', error.message);
			res.status(500).json({ error: 'Internal server error' });
		}
	},
};

export default UserController;
