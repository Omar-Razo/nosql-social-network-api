const { User, Thought } = require('../models')

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    },
    // get single user by _id and populate thoughts and friends
    async getSingleUser(req, res) {
        try {
            const user = await User.findById(req.params.userId)
                .select('-__v')
                .populate('thoughts')
                .populate('friends')

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID!'})
            }

            res.json(user)
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    },
    // post new user
    async createUser(req, res) {
        try {
            const createdUser = await User.create(req.body)

            res.json(createdUser)
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err)
        }
    },
    // put/update user by _id
    async updateUser(req, res) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                // filter
                { _id: req.params.userId },
                // updated fields
                req.body,
                // returned doc is updated version
                { runValidators: true, new: true }
            )

            if (!updatedUser) {
                return res.status(404).json({ message: 'No user with that ID!'})
            }

            res.json(updatedUser)
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err)
        }
    },
    // delete user by _id (add associated thoughts)
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
    
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and associated thoughts deleted!' })
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    },
    // post new friend to user's friend list
    async addFriend(req, res) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { friends: req.params.friendId } },
                { new: true }
            )
            .populate('friends');

            if (!updatedUser) {
                return res.status(404).json({ message: 'No user with that ID!'})
            }

            res.json(updatedUser)
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    },
    // delete friend from user's friend list
    async deleteFriend(req, res) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )
            .populate('friends');

            if (!updatedUser) {
                return res.status(404).json({ message: 'No user with that ID!'})
            }

            res.json(updatedUser)
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    }
}