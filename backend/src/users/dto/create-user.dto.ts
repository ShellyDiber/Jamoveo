import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;
  
  @IsString()
  password: string;

  @IsString()
  instrument: string;

  @IsOptional()
  @IsIn(['player', 'admin'])
  role?: 'player' | 'admin';
}