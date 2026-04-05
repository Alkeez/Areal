import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateOrganizationDto) {
    try {
      const sql = `INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING *;`;
      const result = await this.db.query(sql, [dto.name, dto.comment]);
      return result.rows[0];
    } catch (error) {
      throw new BadRequestException('Ошибка при создании организации');
    }
  }

  async findAll() {
    const result = await this.db.query(`SELECT * FROM organizations WHERE deleted_at IS NULL;`);
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(`SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL;`, [id]);
    if (!result.rows[0]) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }
    return result.rows[0];
  }

  async update(id: number, dto: CreateOrganizationDto) {
    // Проверяем существование перед обновлением
    await this.findOne(id); 
    
    const sql = `UPDATE organizations SET name = $1, comment = $2, updated_at = NOW() WHERE id = $3 RETURNING *;`;
    const result = await this.db.query(sql, [dto.name, dto.comment, id]);
    return result.rows[0];
  }

  async remove(id: number) {
    // Проверяем существование перед удалением
    await this.findOne(id);
    
    const sql = `UPDATE organizations SET deleted_at = NOW() WHERE id = $1;`;
    await this.db.query(sql, [id]);
    return { success: true };
  }
}