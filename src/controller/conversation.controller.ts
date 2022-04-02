import { Request, Response } from "express"
import { HttpStatusCode, JSONResponse } from "../helper/client"
import ConversationModel from "../model/conversation.model"
import MessageModel from "../model/message.model"

export async function createConversationHandler(req: Request, res: Response) {
    try {
        const checkExistConversation = await ConversationModel.findOne({members: {
            $all: req.body.members
        }})
        if (checkExistConversation) {
            return JSONResponse.sendSuccess(
                res,
                checkExistConversation.toJSON(),
                'Conversation is exist.'
            )
        }

        const conversation = await ConversationModel.create(req.body)

        return JSONResponse.sendSuccess(
            res,
            conversation.toJSON(),
            'create conversation successfully.'
        )
    } catch (error) {
        console.log(error)
        JSONResponse.sendErrorServerInterval(res)
    }
}

export async function getCoverastionHandler(
    req: Request<{ conversationId: string }, {}, {}, {}>,
    res: Response
) {
    const { conversationId } = req.params

    try {
        const conversation = await ConversationModel.findById(conversationId)
                            .populate({path: "members", select: "_id name"})
        
        if (!conversation) {
            return JSONResponse.sendError(
                res,
                HttpStatusCode.BAD_REQUEST,
                'conversation not found.'
            )
        }

        return JSONResponse.sendSuccess(
            res,
            conversation.toJSON(),
            'retreive conversation successfully.'
        )
    } catch (error) {
        console.log(error)
        return JSONResponse.sendErrorServerInterval(res)
    }
}

export async function getConversationByMember(req: Request, res: Response) {
    const { members } = req.body

    try {
        const conversations = await ConversationModel.find({members: {
            $all: members
        }})

        return JSONResponse.sendSuccess(
            res,
            conversations,
            'get conversation by member successfully.'
        )
    } catch (error) {
        console.log(error)
        return JSONResponse.sendErrorServerInterval(res)
    }
}

export async function getMessageFromConversationHanlder(
    req: Request<{ conversationId: string }, {}, {}, { limit: string, page: string }>,
    res: Response
) {
    const limit = parseInt(req.query.limit) ?? 10
    const page = parseInt(req.query.page) ?? 1
    const { conversationId } = req.params

    try {
        const checkExistConversation = await ConversationModel.exists({ _id: conversationId })
        if (!checkExistConversation) {
            return JSONResponse.sendError(
                res,
                HttpStatusCode.BAD_REQUEST,
                'conversation not found.'
            )
        }

        const messages = await MessageModel.find({ conversation: conversationId })
                                            .sort('-createdAt')
                                            .limit(limit)
                                            .skip(limit * (page - 1))

        return JSONResponse.sendSuccess(
            res,
            messages.reverse(),
            'retreive message from conversation successfully.'
        )
    } catch (error) {
        console.log(error)
        JSONResponse.sendErrorServerInterval(res)
    }
}