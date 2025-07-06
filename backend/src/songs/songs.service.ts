import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Song } from './song.entity';
import { SongsGateway } from '../gateways/songs.gateway';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepo: Repository<Song>,
    private readonly songsGateway: SongsGateway,
  ) { }

  async findAll(): Promise<Song[]> {
    return this.songRepo.find();
  }


  async findByQuery(query: string): Promise<Song[]> {
    return this.songRepo.find({
      where: [
        { title: ILike(`%${query}%`) },
        { artist: ILike(`%${query}%`) },
      ],
    });
  }

  async create(songData: Partial<Song>): Promise<Song> {
    const song = this.songRepo.create(songData);
    return this.songRepo.save(song);
  }

  async findOne(id: number): Promise<Song | null> {
    return this.songRepo.findOneBy({ id });
  }

  private currentSong: Song | null = null;

  async playSong(id: number): Promise<Song | null> {
    const song = await this.findOne(id);
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
    this.currentSong = song; // save the current song
    console.log(`Playing song with ID ${id}: ${song.title} by ${song.artist}`);
    this.songsGateway.broadcastSong(song); // Notify all connected clients about the new song
    return song;
  }

  getCurrentSong(): Song | null {
    return this.currentSong;
  }


}