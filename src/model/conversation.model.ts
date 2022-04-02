import mongoose from "mongoose"
import { MessageDocument } from "./message.model"
import { UserDocument } from "./user.model"
const { Schema } = mongoose

export interface ConversationInput {
    members: UserDocument["_id"][]
}

export interface ConversationDocument extends ConversationInput, mongoose.Document {
    lastMessage?: MessageDocument["_id"]
    name?: string
    avatar?: string
    createdAt: Date
    updatedAt: Date
}

const ConversationSchema = new Schema(
    {
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        ],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'message',
            default: null
        },
        name: String,
        avatar: String
    },
    {
        timestamps: true
    }
)

const ConversationModel = mongoose.model<ConversationDocument>('conversation', ConversationSchema)

export default ConversationModel