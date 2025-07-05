import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SongsModule } from './songs/songs.module';
import { Song } from './songs/song.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'jamoveo',
      password: 'jamoveo',
      database: 'jamoveo',
      entities: [User, Song],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    SongsModule,
  ],
})
export class AppModule {}
