import { Controller, Post, Body, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any, @Req() req: Request) {
    const user = await this.authService.validateUser(body.login, body.password);
    if (!user) {
      throw new UnauthorizedException('Неверные данные');
    }
    
    // Принудительно создаем сессию
    return new Promise((resolve, reject) => {
      req.logIn(user, (err) => {
        if (err) return reject(err);
        resolve(user); // Возвращаем пользователя только после успешного логина
      });
    });
  }

  @Post('logout')
  async logout(@Req() req) {
    req.session.destroy(() => {});
    return { message: 'Logged out' };
  }

  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}