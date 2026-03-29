import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

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
      dto.parent_id || null, // Если parent_id не передан, ставим null
      dto.name, 
      dto.comment
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
    return result.rows[0];
  }

  async update(id: number, dto: CreateDepartmentDto) {
    const sql = `
      UPDATE departments
      SET organization_id = $1, parent_id = $2, name = $3, comment = $4, updated_at = NOW()
      WHERE id = $5 AND deleted_at IS NULL
      RETURNING *;
    `;
    const result = await this.db.query(sql, [
      dto.organization_id, 
      dto.parent_id || null, 
      dto.name, 
      dto.comment, 
      id
    ]);
    return result.rows[0];
  }

  async remove(id: number) {
    const sql = `UPDATE departments SET deleted_at = NOW() WHERE id = $1;`;
    await this.db.query(sql, [id]);
    return { success: true };
  }
}