export interface User {
    socketId: string
    name: string
    _id: string
}

class UserContainer {
    private users: User[]

    constructor() {
        this.users = []
    }

    /**
     * Add new user to user container
     * @param newUser
     */
    addUser(newUser: User): void {
        const user = this.users.find(user => user._id === newUser._id)

        if (!user) {
            this.users.push(newUser)
        }
    }

    /**
     * remove user from user container
     * @param socketId 
     */
    removeUser(socketId: string): void {
        this.users = this.users.filter(user => user.socketId != socketId)
    }

    /**
     * get all user from user container
     * @returns User[]
     */
    getAllUsers(): User[] {
        return this.users
    }

    /**
     * get user from user container
     * @param _id 
     * @returns User | undefined
     */
    getUser(socketId: string): User | undefined {
        return this.users.find(user => user.socketId == socketId)
    }

    /**
     * get user from user container
     * @param _id 
     * @returns User | undefined
     */
    getUserById(userId: string): User | undefined {
        return this.users.find(user => user._id == userId)
    }

    /**
     * get all user in user container except userExceptId
     * @param userExceptId 
     * @returns User[]
     */
    getUserExcept(userExceptId: string): User[] {
        return this.users.filter(user => user._id != userExceptId)
    }
}

export default UserContainer