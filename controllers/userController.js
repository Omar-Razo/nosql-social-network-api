const { User } = require('../models/User')

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (err) {
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
            res.status(500).json(err);
        }
    },
    // post new user
    async createUser(req, res) {
        try {
            const createdUser = await User.create(req.body)

            res.json(createdUser)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // put/update user by _id
    async updateUser(req ,res) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.}
            )
        }
    }

    // delete user by _id (add associated thoughts)


    // post new friend to user's friend list


    // delete friend from user's friend list
}