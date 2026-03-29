import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Inject } from '@nestjs/common';

@Injectable()
export class DbService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: 'localhost',
      port: 5433, // Тот самый порт, на котором заработал Docker
      user: 'postgres',
      password: 'postgres',
      database: 'areal_hr',
    });
  }

  // Метод для выполнения запросов
  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}