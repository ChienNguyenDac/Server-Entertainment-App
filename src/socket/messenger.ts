import { Server, Socket } from "socket.io"
import UserContainer from "../helper/user-container"


enum MessengerEvent {
    JOIN_CONVERSATION = 'join-conversation',
    LEAVE_CONVERSATION = 'leave-conversation',
    SEND_MSG_TO_CONVERSATION = 'send-msg-to-conversation',
    RECEIVE_MSG_FROM_CONVERSATION = 'receive-msg-from-conversation',
    SEND_MSG = 'send-msg',
    RECEIVE_MSG = 'receive-msg',
    CALL_USER = 'call-user',
    CALL_MADE = 'call-made',
    MAKE_ANSWER = 'make-answer',
    ANSWER_MADE = 'answer-made',
    REJECT_CALL = 'reject-call',
    CALL_REJECTED = 'call-rejected'
}

class Messenger {
    private io: Server
    private userContainer: UserContainer

    constructor(io: Server, userContainer: UserContainer) {
        this.io = io
        this.userContainer = userContainer
    }

    initalized(socket: Socket) {
        this.joinConversation(socket)
        this.leaveConversation(socket)
        this.sendMessageToConversation(socket)
        this.sendMessageEvent(socket)
        this.callUserEvent(socket)
        this.makeAnswerEvent(socket)
        this.makeRejectEvent(socket)
    }

    private joinConversation(socket: Socket) {
        socket.on(MessengerEvent.JOIN_CONVERSATION, conversationId => {
            socket.join(conversationId)
        })
    }

    private leaveConversation(socket: Socket) {
        socket.on(MessengerEvent.LEAVE_CONVERSATION, conversationId => {
            socket.leave(conversationId)
        })
    }

    private sendMessageToConversation(socket: Socket) {
        socket.on(MessengerEvent.SEND_MSG_TO_CONVERSATION, ({ message, conversationId }) => {
            console.log(message, conversationId)
            const user = this.userContainer.getUser(socket.id)
            socket.broadcast.to(conversationId).emit(MessengerEvent.RECEIVE_MSG_FROM_CONVERSATION, {
                message,
                sender: user
            })
        })
    }

    private sendMessageEvent(socket: Socket) {
        socket.on(MessengerEvent.SEND_MSG, ({ message, to }) => {
            const user = this.userContainer.getUser(socket.id)
            const receiver = this.userContainer.getUserById(to)
            if (receiver) {
                socket.to(receiver.socketId).emit(MessengerEvent.RECEIVE_MSG, {
                    message,
                    sender: user
                })
            }
        })
    }
    
    private callUserEvent(socket: Socket) {
        socket.on(MessengerEvent.CALL_USER, ({ offer, to }) => {
            const user = this.userContainer.getUser(socket.id)
            socket.to(to).emit(MessengerEvent.CALL_MADE, {
                offer, user
            })
        })
    }

    private makeAnswerEvent(socket: Socket) {
        socket.on(MessengerEvent.MAKE_ANSWER, ({ answer, to }) => {
            const user = this.userContainer.getUser(socket.id)

            socket.to(to).emit(MessengerEvent.ANSWER_MADE, {
                user,
                answer: answer
            })
        })
    }

    private makeRejectEvent(socket: Socket) {
        socket.on(MessengerEvent.REJECT_CALL, ({ from }) => {
            const user = this.userContainer.getUser(socket.id)

            socket.to(from).emit(MessengerEvent.CALL_REJECTED, { user })
        })
    }
}

export default Messenger