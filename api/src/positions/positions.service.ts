import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { ChangeHistoryService } from '../change_history/change_history.service';

@Injectable()
export class PositionsService {
  constructor(
    private readonly db: DbService,
    private readonly history: ChangeHistoryService
  ) {}

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
    const oldItem = await this.findOne(id);

    const keys = Object.keys(dto);
    if (keys.length === 0) return oldItem;

    const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map(key => (dto as any)[key] ?? null);

    const sql = `UPDATE positions SET ${sets}, updated_at = NOW() WHERE id = $${keys.length + 1} AND deleted_at IS NULL RETURNING *;`;
    const result = await this.db.query(sql, [...values, id]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Должность с ID ${id} не найдена или была удалена`);
    }

    // История
    for (const key of keys) {
      const oldVal = String(oldItem[key] ?? '');
      const newVal = String((dto as any)[key] ?? '');
      if (oldVal !== newVal) {
        await this.history.create({
          entity_type: 'position',
          entity_id: id,
          field_name: key,
          old_value: oldVal,
          new_value: newVal,
        });
      }
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