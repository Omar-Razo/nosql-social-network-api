const { User, Thought } = require('../models')

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()
            res.json(thoughts)
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    },
    // get single thought by id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findById(req.params.userId)
                .select('-__v')

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID!'})
            }

        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    },
    // post new thought and push new thought to associated user's thoughts
    async createAndAddThought(req, res) {
        try {
            const thought = await Thought.create(req.body)

            const updatedUser = await User.findOneAndUpdate(
                { username: req.body.userId },
                { $push: { thoughts: thought._id } },
                { runValidators: true, new: true }
            )

            res.json(thought, updatedUser)
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    },
    // put/update thought by id
    async updateThought(req, res) {
        try {
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                req.body,
                { runValidators: true, new: true }
            )

            res.json(updatedThought)
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    },
    // delete thought by id
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId })

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json({ message: 'Thought deleted!' })
        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    },
    // post new reaction in associated thought's reactions
    async addReaction(req, res) {
        try {
            const reaction = req.body
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: reaction } },
                { new: true }
            )

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID!' });
            }

            res.json(reaction, thought)
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                // validation error
                res.status(400).json({ message: 'Validation error', details: err.errors });
            } else {
                // other errors
                console.log('Uh Oh, something went wrong');
                res.status(500).json(err);
            }
        }
    },
    // delete reaction by reactionId
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            )

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID!' });
            }

        } catch (err) {
            console.log('Uh Oh, something went wrong');
            res.status(500).json(err);
        }
    }
}

