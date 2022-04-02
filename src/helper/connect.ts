import mongoose from "mongoose"
import config from "config"

async function connect() {
    const dbUri = config.get<string>('dbUri')
    
    try {
        await mongoose.connect(dbUri)
        console.info("Connect to MongoDB successfully.")
    } catch (error) {
        console.error("Cannot connect to MongoDB.")
        process.exit(1)
    }
}

export default connect