import { WebSocket, isWebSocketCloseEvent } from '../dep.ts';
import { requests } from './requests.ts';
import logger from '../common/utils/logger.ts';

class User {
    id: string;
    socket!: WebSocket;
    ws!: any;
    info: any;
    handlers: any;

    constructor(id: string, ws: any, info = {}) {
        this.id = id;
        this.ws = ws;
        this.info = info;
        this.handlers = new Map();

        this.init();
    }

    init() {
        requests(this);
    }

    on(cmd: string, cb: any) {
        this.handlers.set(cmd, cb);
    }

    handle(cmd: string, payload: any) {
        let handle = this.handlers.get(cmd);
        if (handle) handle(payload);
    }

    send(cmd: string, payload: any) {
        //encode events
        this.socket.send(JSON.stringify({ cmd, payload }));
    }

    async login(socket: any, connected: any, disconnected: any) {
        this.socket = socket;
        this.send('login', 'login success.');

        await connected();
        logger.info(`[ User ] ${this.id} is connected!`);

        try {
            for await (const event of this.socket) {
                //listen events
                logger.debug(
                    `event: ${
                        typeof event === 'string'
                            ? event
                            : JSON.stringify(event)
                    }`,
                );

                if (isWebSocketCloseEvent(event)) {
                    await disconnected();
                    logger.info(`[ User ] ${this.id} is disconnected!`);
                } else {
                    //decode events
                    const { cmd, payload } = JSON.parse(event as string);
                    if (cmd === 'logout') throw Error('logout');
                    if (cmd) this.handle(cmd, payload);
                }
            }
        } catch (error) {
            logger.info(`${this.id} ${error.message}`);
            await this.logout();
        }
    }

    async logout() {
        if (!this.socket.isClosed) {
            this.send('logout', 'you are logout.');
            this.ws.kickOut(this);
            await this.socket.close();
        }
    }
}

export default User;
