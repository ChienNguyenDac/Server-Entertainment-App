import { Server, Socket } from "socket.io"
import UserContainer from "../helper/user-container"
import Room from "../helper/room"

enum ErrorType {
    ROOM_IS_FULL = 'room is full',
    ROOM_NOT_FOUND = 'room is not found'
}

enum CaroGameEvent {
    CREATE_ROOM = 'create-room',
    JOIN_ROOM = 'join-room',
    GET_ERROR = 'get-error',
    LEAVE_ROOM = 'leave-room',
    UPDATE_BOARD = 'update-board',
    GET_BOARD = 'get-board',
    GAME_START = 'game-start',
    GAME_PLAY = 'game-play',
    GAME_UPDATE = 'game-update',
    GAME_OVER = 'game-over',
    // GET_PLAYER = 'get-player'
}

class CaroGame {
    io: Server
    private rooms: Room[]

    constructor(io: Server) {
        this.io = io
        this.rooms = []
    }

    initialized(socket: Socket) {
        this.createRoom(socket)
        this.joinRoom(socket)
        this.leaveRoom(socket)
        this.playGame(socket)
    }

    private createRoom(socket: Socket): void {
        socket.on(CaroGameEvent.CREATE_ROOM, (roomId: string) => {
            const room = new Room(roomId)
            this.rooms.push(room)
        })
    }

    private leaveRoom(socket: Socket): void {
        socket.on(CaroGameEvent.LEAVE_ROOM, (
            {roomId, userId}: {roomId: string, userId: string}
        ) => {
            const room = this.findRoomById(roomId)

            if (room) {
                socket.leave(roomId)
                room.removePlayer(userId)
                if (room.isEmptyPlayer()) {
                    this.removeRoom(roomId)
                }
            }
        })
    }

    private joinRoom(socket: Socket): void {
        socket.on(CaroGameEvent.JOIN_ROOM, (
            {roomId, userId, userName}: {roomId: string, userId: string, userName: string}
        ) => {
            const room = this.findRoomById(roomId)

            if (!room) {
                socket.emit(CaroGameEvent.GET_ERROR, ErrorType.ROOM_NOT_FOUND)
            } else {
                const check = room.addPlayer({
                    socketId: socket.id,
                    name: userName,
                    _id: userId
                })
                
                if (check) {
                    socket.join(roomId)
                    if (room.isFullPlayer()) {
                        this.io.to(roomId).emit(CaroGameEvent.GAME_START, {
                            players: room.getPlayers(),
                            board: room.getBoard()
                        })
                    }
                } else {
                    socket.emit(CaroGameEvent.GET_ERROR, ErrorType.ROOM_IS_FULL)
                }
            }

            console.log(room)
        })
    }

    private playGame(socket: Socket): void {
        socket.on(CaroGameEvent.GAME_PLAY, (
            {roomId, x, y, value}: {roomId: string, x: number, y: number, value: string}
        ) => {
            const room = this.findRoomById(roomId)
            
            if (room) {
                const check = room.updateBoard(x, y, value as ('o' | 'x'))
                
                if (check) {
                    socket.broadcast.to(roomId).emit(
                        CaroGameEvent.GAME_UPDATE,
                        room.getBoard()
                    )

                    if (room.winner) {
                        console.log(room.winner)
                        this.io.to(roomId).emit(
                            CaroGameEvent.GAME_OVER,
                            room.winner
                        )
                    }
                }
            }
        })
    }

    private findRoomById(roomId: string): Room | undefined{
        return this.rooms.find(room => room.id === roomId)
    }

    private removeRoom(roomId: string) {
        this.rooms = this.rooms.filter(room => room.id === roomId)
    }
}

export default CaroGame