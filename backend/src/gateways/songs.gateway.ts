// songs.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Song } from 'src/songs/song.entity';

@WebSocketGateway({
  namespace: '/api/ws',
  cors: {
    origin: '*', // Allow all origins for development; adjust for production
  },
})
export class SongsGateway {
  @WebSocketServer()
  server: Server;

  // send a new song to all connected clients
  broadcastSong(song: Song) {
    this.server.emit('new-song', song);
  }

  // get song from client and broadcast it to all connected clients
  @SubscribeMessage('play-song')
  handlePlaySong(@MessageBody() song: Song) {
    this.server.emit('new-song', song); // broadcast to all connected clients
  }

  @SubscribeMessage('quit-song')
  handleQuitSong(@MessageBody() data: any): void {
    this.server.emit('song-ended'); // broadcast to all connected clients
}

}
