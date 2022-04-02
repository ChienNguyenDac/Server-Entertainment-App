import { Application, Request, Response } from "express"
import { userLoginHandler, userRegisterHandler } from "../controller/auth.controller"
import { createConversationHandler, getConversationByMember, getCoverastionHandler, getMessageFromConversationHanlder } from "../controller/conversation.controller"
import { createMessageHandler } from "../controller/message.controller"

function routes(app: Application) {
    app.get('/', (req: Request, res: Response) => res.sendStatus(200))
    app.get('/healthz', (req: Request, res: Response) => res.sendStatus(200))
    
    app.post('/api/auth/register', userRegisterHandler)
    app.post('/api/auth/login', userLoginHandler)

    app.post('/api/conversation/create', createConversationHandler)
    app.post('/api/conversation/get-by-member', getConversationByMember)
    app.get('/api/conversation/:conversationId', getCoverastionHandler)
    app.get('/api/conversation/:conversationId/get-message', getMessageFromConversationHanlder)

    app.post('/api/message/create', createMessageHandler)
}

export default routes