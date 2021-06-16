import React from 'https://esm.sh/react@17.0.2?dev';

const { useEffect } = React;
let ws: any;

export const App = () => {
    const onReceiveMessage = ({ data = '' }) => {
        console.log(data);
    };
    const onSendMessage = (e: any) => {
        const msg = e.target[0].value;

        e.preventDefault();
        ws.send(
            JSON.stringify({
                cmd: 'chat',
                payload: msg,
            }),
        );
        e.target[0].value = '';
    };

    const onLogout = () => {
        ws.send(
            JSON.stringify({
                cmd: 'logout',
                payload: '',
            }),
        );
    };

    // Websocket connection + events
    useEffect(() => {
        if (ws) ws.close();
        const url = new URL(location.href);
        ws = new WebSocket(
            `ws://localhost:3001?token=${
                url.searchParams.get('token') || 'test'
            }`,
        );
        ws.addEventListener('message', onReceiveMessage);

        return () => {
            ws.removeEventListener('message', onReceiveMessage);
        };
    }, []);

    return (
        <div>
            <form onSubmit={onSendMessage}>
                <input type="text" />
                <button>Send</button>
                <button onClick={onLogout}>logout</button>
            </form>
        </div>
    );
};
