import mongoose from "mongoose"
import { ConversationDocument } from "./conversation.model"
import { UserDocument } from "./user.model"
const { Schema } = mongoose

export interface MessageInput {
    conversation: ConversationDocument["_id"]
    sender: UserDocument["_id"]
    content: string
}

export interface MessageDocument extends MessageInput, mongoose.Document {
    createdAt: Date
    updatedAt: Date
}

const MessageSchema = new Schema(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'conversation',
            required: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const MessageModel = mongoose.model<MessageDocument>('message', MessageSchema)

export default MessageModel