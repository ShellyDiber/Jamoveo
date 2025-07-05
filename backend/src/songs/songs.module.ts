// src/songs/songs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from './song.entity';
import { SongsGateway } from '../gateways/songs.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [SongsService, SongsGateway],
  controllers: [SongsController],
  exports: [SongsService, SongsGateway],
})
export class SongsModule {}
