const { Schema, Types } = require('mongoose')

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => {
                return timestamp.toISOString()
            }
        },
        username: {
            type: String,
            required: true,
        },
        reactions:
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
)