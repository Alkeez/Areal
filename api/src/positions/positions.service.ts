import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

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
    if (!result.rows[0]) {
      throw new NotFoundException(`Должность с ID ${id} не найдена`);
    }
    return result.rows[0];
  }

  async update(id: number, dto: UpdatePositionDto) {
    const keys = Object.keys(dto);
    if (keys.length === 0) {
      return this.findOne(id);
    }

    const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map(key => (dto as any)[key] ?? null);

    const sql = `
      UPDATE positions SET ${sets}, updated_at = NOW()
      WHERE id = $${keys.length + 1} AND deleted_at IS NULL
      RETURNING *;
    `;

    const result = await this.db.query(sql, [...values, id]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Должность с ID ${id} не найдена или была удалена`);
    }
    return result.rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    const sql = `UPDATE positions SET deleted_at = NOW() WHERE id = $1;`;
    await this.db.query(sql, [id]);
    return { success: true };
  }
}