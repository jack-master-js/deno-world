export function requests(user: any) {
    user.on('ping', (payload: any) => {
        user.send('pong', {
            clientTime: payload.clientTime,
            serverTime: Date.now(),
        });
    });

    user.on('chat', (payload: any) => {
        user.ws.broadcast('broadcast', `${user.id} says ${payload}`);
    });
}
