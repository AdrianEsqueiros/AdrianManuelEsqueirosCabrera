import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: any;

    private clients: Set<WebSocket> = new Set();

    handleConnection(client: WebSocket) {
        this.clients.add(client);
        console.log('Client connected.');
    }

    handleDisconnect(client: WebSocket) {
        this.clients.delete(client);
        console.log('Client disconnected.');
    }

    @SubscribeMessage('chat')
    handleMessage(client: WebSocket, payload: any) {
        const message = { text: payload.text, timestamp: new Date() };
        this.broadcastMessage(message);
    }

    private broadcastMessage(message: any) {
        this.clients.forEach(client => {
            client.send(JSON.stringify(message));
        });
    }
}
