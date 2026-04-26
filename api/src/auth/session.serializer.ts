import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null as any, user.id);
  }

  async deserializeUser(userId: number, done: (err: Error, payload: any) => void) {
    const user = await this.usersService.findOne(userId);
    done(null as any, user);
  }
}