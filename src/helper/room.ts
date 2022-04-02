import { User } from "./user-container"

interface Player extends User {
    type?: 'x' | 'o',
    isGoingFirst?: boolean
}

class Room {
    private board: (string | null)[][]
    private players: Player[]

    public id: string
    public winner: 'x' | 'o' | null
    
    constructor(roomId: string) {
        this.id = roomId
        this.board = [
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null]
        ]
        this.players = []
        this.winner = null
    }

    updateBoard(x: number, y: number, value: 'x' | 'o'): boolean {
        if (this.board[x][y]) {
            return false
        } else {
            this.board[x][y] = value
            const check = this.checkPosibleWin(x, y, value)

            if (check) {
                this.winner = value
            }
            return true
        }
    }

    getBoard(): (string | null)[][] {
        return this.board
    }

    isEmptyPlayer(): boolean {
        return this.players.length === 0
    }

    isFullPlayer(): boolean {
        return this.players.length === 2
    }

    getPlayers(): Player[] {
        return this.players
    }

    addPlayer(player: Player): boolean {
        if (this.isFullPlayer()) {
            return false
        }
        
        player.type = this.isEmptyPlayer() ? 'x' : 'o'
        player.isGoingFirst = this.isEmptyPlayer() ? true : false
        this.players.push(player)
        return true
    }

    removePlayer(userId: string): void {
        this.players = this.players.filter(player => player._id !== userId)
    }

    checkPosibleWin(i: number, j: number, type: 'x' | 'o'): boolean {
        let count = 0
        let x = i, y = j
        while(x >= 0) {
            if (this.board[x][y] === type) {
                count++
                if(count === 5) {
                    return true
                }
                x--
            } else {
                break
            }
        }
        x = i
        y = j + 1
        while(x < 10) {
            if (this.board[x][y] === type) {
                count++
                if(count === 5) {
                    return true
                }
                x++
            } else {
                break
            }
        }

        count = 0
        x = i
        y = j
        while(x < 10 && y >= 0) {
            if (this.board[x][y] === type) {
                count++
                if(count === 5) {
                    return true
                }
                x++
                y--
            } else {
                break
            }
        }
        x = i - 1
        y = j + 1
        while(x >= 0 && y < 10) {
            if (this.board[x][y] === type) {
                count++
                if(count === 5) {
                    return true
                }
                x--
                y++
            } else {
                break
            }
        }

        count = 0
        x = i
        y = j
        while(x >= 0 && y >= 0) {
            if (this.board[x][y] === type) {
                count++
                if(count === 5) {
                    return true
                }
                x--
                y--
            } else {
                break
            }
        }
        x = i + 1
        y = j + 1
        while(x < 10 && y < 10) {
            if (this.board[x][y] === type) {
                count++
                if(count === 5) {
                    return true
                }
                x++
                y++
            } else {
                break
            }
        }

        return false
    }
}

export default Room