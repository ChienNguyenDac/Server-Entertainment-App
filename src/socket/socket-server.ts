import { Server as HttpServer } from "http"
import { ServerOptions, Server, Socket } from "socket.io"
import UserContainer, { User } from "../helper/user-container"
import Messenger from "./messenger"
import CaroGame from "./caro-game"



enum SocketEvent {
    CONNECTION = 'connection',
    ADD_USER = 'add-user',
    UPDATE_USER = 'update-user',
    REMOVE_USER = 'remove-user',
    DISCONNECT = 'disconnect',
}

class SocketServer{
    private io: Server
    private userContainer: UserContainer

    constructor(httpServer: HttpServer, opts?: Partial<ServerOptions>) {
        this.io = new Server(httpServer, opts)
        this.userContainer = new UserContainer()
        this.initalizeConnection()
    }

    initalizeConnection() {
        this.io.on(SocketEvent.CONNECTION, (socket: Socket) => {
            console.log(`new socket ${socket.id} is connected.`)
            this.addUserEvent(socket)
            this.disconnectionEvent(socket)
            new Messenger(this.io, this.userContainer).initalized(socket)
            new CaroGame(this.io).initialized(socket)
        })
    }

    private addUserEvent(socket: Socket) {
        socket.on(SocketEvent.ADD_USER, (userId: string, userName: string) => {
            // remove old user
            // const user = this.userContainer.getUserById(userId)
            
            // if (user) {
            //     socket.emit
            // }
            socket.emit(SocketEvent.UPDATE_USER, {
                users: this.userContainer.getAllUsers()
            })
            
            const newUser: User = {
                socketId: socket.id,
                _id: userId,
                name: userName
            }

            this.userContainer.addUser(newUser)
            socket.broadcast.emit(SocketEvent.UPDATE_USER, {
                users: [ newUser ]
            })            
        })
    }

    private disconnectionEvent(socket: Socket) {
        socket.on(SocketEvent.DISCONNECT, () => {
            console.log('a user is disconnected.')
            this.userContainer.removeUser(socket.id)

            this.io.emit(SocketEvent.REMOVE_USER, {
                socketId: socket.id
            })
        })
    }

}

export default SocketServer