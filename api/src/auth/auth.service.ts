import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.usersService.findByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const passwordValid = await argon2.verify(user.password, pass);
    if (!passwordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const { password, ...result } = user;
    return result;
  }
}