

import { backendServerURL } from './config';
import { io, Socket } from 'socket.io-client';

export function getWebSocket() : Socket {
    const socket = io(`${backendServerURL}/api/ws`);
    return socket;
}

