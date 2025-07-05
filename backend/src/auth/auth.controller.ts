// backend/src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('/login')
  async login(@Body() dto: LoginUserDto) {
    const user = await this.authService.validateUser(dto.username, dto.password);
    return this.authService.login(user);
  }

  
}
