// src/songs/songs.controller.ts
import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './song.entity';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get('play/:id')
  async playSong(@Param('id') id: number): Promise<Song | null> {
    return this.songsService.playSong(id);
  }
  
  
  @Get()
  async getAll(@Query('q') query?: string): Promise<Song[]> {
    console.log('Query:', query); 
    if (query) {
      return this.songsService.findByQuery(query);
    }
    return this.songsService.findAll();
  }

  @Get('current')
  getCurrentSong(): Song | null {
   return this.songsService.getCurrentSong();
    }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Song | null> {
    return this.songsService.findOne(id);
  }

  @Post()
  async addSong(@Body() songData: Partial<Song>): Promise<Song> {
    return this.songsService.create(songData);
  }

  

  
}
