import { Request, Response } from "express"
import { JSONResponse } from "../helper/client"
import ConversationModel from "../model/conversation.model"
import MessageModel from "../model/message.model"

export async function createMessageHandler(req: Request, res: Response) {
    try {
        const message = await MessageModel.create(req.body)
        return JSONResponse.sendSuccess(
            res,
            message.toJSON(),
            'create a message successfully.'
        )
    } catch (error) {
        console.log(error)
        return JSONResponse.sendErrorServerInterval(res)
    }
}