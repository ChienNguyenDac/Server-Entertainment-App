import express, { Application } from "express"
import { Server as HttpServer, createServer } from "http"
import cors, { CorsOptions } from "cors"
import routes from "./routes/api"
import SocketServer from "./socket/socket-server"

const app: Application = express()
const httpServer: HttpServer = createServer(app)
new SocketServer(httpServer, {
    cors: {
        origin: "*"
    }
})

const corsOptions: CorsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
routes(app)


export default httpServer