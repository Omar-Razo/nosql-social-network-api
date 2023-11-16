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


    // put/update thought by id


    // delete thought by id


    // post new reaction in associated thought's reactions


    // delete reaction by reactionId
}

