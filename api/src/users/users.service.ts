import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateUserDto) {
    // Хешируем пароль
    const hash = await argon2.hash(dto.password);
    
    const sql = `
      INSERT INTO users (surname, first_name, patronymic, login, password, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, surname, first_name, patronymic, login, role, created_at;
    `;
    const result = await this.db.query(sql, [
      dto.surname, dto.first_name, dto.patronymic, dto.login, hash, dto.role
    ]);
    return result.rows[0];
  }

  async findAll() {
    const sql = `SELECT id, surname, first_name, patronymic, login, role, created_at FROM users WHERE deleted_at IS NULL;`;
    const result = await this.db.query(sql);
    return result.rows;
  }

  async findOne(id: number) {
    const sql = `SELECT id, surname, first_name, patronymic, login, role, created_at FROM users WHERE id = $1 AND deleted_at IS NULL;`;
    const result = await this.db.query(sql, [id]);
    if (!result.rows[0]) throw new NotFoundException('Пользователь не найден');
    return result.rows[0];
  }

  async findByLogin(login: string) {
    const sql = `SELECT * FROM users WHERE login = $1 AND deleted_at IS NULL;`;
    const result = await this.db.query(sql, [login]);
    return result.rows[0];
  }

  async update(id: number, dto: Partial<CreateUserDto>) {
    const keys = Object.keys(dto).filter(k => k !== 'password');
    if (keys.length === 0) return this.findOne(id);

    const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map(key => (dto as any)[key]);

    const sql = `UPDATE users SET ${sets}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING id, surname, first_name, patronymic, login, role, created_at;`;
    const result = await this.db.query(sql, [...values, id]);
    return result.rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query(`UPDATE users SET deleted_at = NOW() WHERE id = $1;`, [id]);
    return { success: true };
  }
}