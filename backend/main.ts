import express from "express";
import { oAuthMiddleWare, sessionMiddleWare } from "./middlewares/middleware";
import http from "http";
import { Server as SocketIO } from "socket.io";
import { setSocketIO } from "./util/socketio";
import env from "./util/env";
import { logger } from "./util/logger";
import { attachApi } from "./api";
import cors from "cors";

let app = express();
const server = new http.Server(app);
const io = new SocketIO(server);
setSocketIO(io);

app.use(cors())
app.use(express.json());
app.use(sessionMiddleWare);
app.use(oAuthMiddleWare);

app.use(express.static("assets/pic"));
app.use(express.static("assets/uploads"));
attachApi(app, io);

server.listen(env.PORT, () => {
	logger.info(`Listening at port ${env.PORT}`);
});
