import { WebSocket, listenAndServe, acceptWebSocket } from '../dep.ts';
import User from '../user/class.ts';
import logger from '../common/utils/logger.ts';

class WsServer {
    users = new Map();

    listen(port: number, cb: any) {
        listenAndServe({ port }, async (request: any) => {
            if (request.headers.get('upgrade') === 'websocket') {
                const { conn, r: bufReader, w: bufWriter, headers } = request;
                acceptWebSocket({
                    conn,
                    bufReader,
                    bufWriter,
                    headers,
                })
                    .then((socket) => {
                        this.handleConnection(socket, request);
                    })
                    .catch(async (err) => {
                        logger.error(
                            `[ ws ] failed to accept websocket: ${err}`,
                        );
                        await request.respond({ status: 400 });
                    });
            }
        });
        cb();
    }

    async handleConnection(socket: WebSocket, req: any): Promise<void> {
        const url = new URL(`http://a.com${req.url}`);
        const token = url.searchParams.get('token');

        try {
            if (token) {
                let user = this.users.get(token);
                if (user) {
                    user.send(
                        'notice',
                        'you are trying to login somewhere else.',
                    );
                    throw Error(
                        `${user.id} trying to login in somewhere else.`,
                    );
                } else {
                    user = new User(token, this);
                }

                user.login(
                    socket,
                    async () => {
                        this.joinIn(user);
                    },
                    async () => {
                        this.kickOut(user);
                    },
                );
            } else {
                throw Error('invalid token');
            }
        } catch (err) {
            logger.error(`[ ws ] handleConnection error: ${err.message}`);
            if (socket) await socket.close();
        }

        logger.info(`users ${this.users.size}`);
    }

    broadcast(cmd: string, msg: any) {
        this.users.forEach((user) => {
            user.send(cmd, msg);
        });
    }

    joinIn(user: User) {
        this.users.set(user.id, user);
        this.broadcast('broadcast', `${user.id} is join.`);
    }

    kickOut(user: User) {
        this.users.delete(user.id);
        this.broadcast('broadcast', `${user.id} is leave.`);
    }
}

export default new WsServer();
