import dotenv from "dotenv"
dotenv.config()

export default {
    port: process.env.PORT || 5000,
    dbUri: process.env.MONGODB_URL || "mongodb://localhost:27017/entertainment_application",
    saltRounds: 10
}