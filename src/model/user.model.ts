import mongoose from "mongoose"
import bcrypt from "bcrypt"
import config from "config"

export interface UserInput {
    email: string;
    name: string;
    password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        avatar: String,
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next) {
    let user = this as UserDocument

    if(!user.isModified) {
        return next()
    }
    const salt = await bcrypt.genSalt(config.get<number>('saltRounds'))
    const hash = await bcrypt.hash(user.password, salt)

    user.password = hash
    return next()
})

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    const user = this as UserDocument
    
    return bcrypt.compare(candidatePassword, user.password).catch(error => false)
}

const UserModel = mongoose.model<UserDocument>("users", userSchema)

export default UserModel