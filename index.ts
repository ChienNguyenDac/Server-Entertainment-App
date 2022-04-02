import config from "config"
import connect from "./src/helper/connect"
import httpServer from "./src/server"

const PORT: number = config.get<number>('port')

httpServer.listen(PORT, async () => {
    console.log(`App is running at http://localhost:${PORT}`)
    await connect()
})