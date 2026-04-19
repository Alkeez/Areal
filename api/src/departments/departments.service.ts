import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateDepartmentDto) {
    const sql = `
      INSERT INTO departments (organization_id, parent_id, name, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await this.db.query(sql, [
      dto.organization_id,
      dto.parent_id || null,
      dto.name,
      dto.comment,
    ]);
    return result.rows[0];
  }

  async findAll() {
    const sql = `SELECT * FROM departments WHERE deleted_at IS NULL;`;
    const result = await this.db.query(sql);
    return result.rows;
  }

  async findOne(id: number) {
    const sql = `SELECT * FROM departments WHERE id = $1 AND deleted_at IS NULL;`;
    const result = await this.db.query(sql, [id]);
    if (!result.rows[0]) {
      throw new NotFoundException(`Отдел с ID ${id} не найден`);
    }
    return result.rows[0];
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const keys = Object.keys(dto);
    if (keys.length === 0) {
      return this.findOne(id);
    }

    const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map(key => (dto as any)[key] ?? null);

    const sql = `
      UPDATE departments SET ${sets}, updated_at = NOW()
      WHERE id = $${keys.length + 1} AND deleted_at IS NULL
      RETURNING *;
    `;

    const result = await this.db.query(sql, [...values, id]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Отдел с ID ${id} не найден или был удален`);
    }
    return result.rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    const sql = `UPDATE departments SET deleted_at = NOW() WHERE id = $1;`;
    await this.db.query(sql, [id]);
    return { success: true };
  }
}