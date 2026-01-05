import http from "http"
import app from "./app.js"
import {initWs} from "./ws/wsInit.js"
import { env } from "./configs/envSchema.js"

const PORT = env.PORT ||3000;

const server = http.createServer(app);

initWs(server);

server.listen(PORT, () =>
  console.log(`Server (HTTP + WS) is up and running on port ${PORT}`)
);