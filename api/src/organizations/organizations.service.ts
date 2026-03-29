import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateOrganizationDto) {
    const sql = `
      INSERT INTO organizations (name, comment)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await this.db.query(sql, [dto.name, dto.comment]);
    return result.rows[0];
  }

  async findAll() {
    const sql = `SELECT * FROM organizations WHERE deleted_at IS NULL;`;
    const result = await this.db.query(sql);
    return result.rows;
  }

  async findOne(id: number) {
    const sql = `SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL;`;
    const result = await this.db.query(sql, [id]);
    return result.rows[0];
  }

  async update(id: number, dto: CreateOrganizationDto) {
    const sql = `
      UPDATE organizations
      SET name = $1, comment = $2, updated_at = NOW()
      WHERE id = $3 AND deleted_at IS NULL
      RETURNING *;
    `;
    const result = await this.db.query(sql, [dto.name, dto.comment, id]);
    return result.rows[0];
  }

  async remove(id: number) {
    // Мягкое удаление
    const sql = `
      UPDATE organizations
      SET deleted_at = NOW()
      WHERE id = $1;
    `;
    await this.db.query(sql, [id]);
    return { success: true };
  }
}