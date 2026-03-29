import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreatePositionDto } from './dto/create-position.dto';

@Injectable()
export class PositionsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreatePositionDto) {
    const sql = `INSERT INTO positions (name) VALUES ($1) RETURNING *;`;
    const result = await this.db.query(sql, [dto.name]);
    return result.rows[0];
  }

  async findAll() {
    const sql = `SELECT * FROM positions WHERE deleted_at IS NULL;`;
    const result = await this.db.query(sql);
    return result.rows;
  }

  async findOne(id: number) {
    const sql = `SELECT * FROM positions WHERE id = $1 AND deleted_at IS NULL;`;
    const result = await this.db.query(sql, [id]);
    return result.rows[0];
  }

  async update(id: number, dto: CreatePositionDto) {
    const sql = `UPDATE positions SET name = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL RETURNING *;`;
    const result = await this.db.query(sql, [dto.name, id]);
    return result.rows[0];
  }

  async remove(id: number) {
    const sql = `UPDATE positions SET deleted_at = NOW() WHERE id = $1;`;
    await this.db.query(sql, [id]);
    return { success: true };
  }
}