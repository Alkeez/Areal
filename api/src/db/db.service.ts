import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DbService {
  private pool: Pool;

    constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      // Исправлено: добавляем пустую строку или дефолтное значение '5433' перед парсингом
      port: parseInt(process.env.DB_PORT || '5433', 10),
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'areal_hr',
    });
  }

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }
}