import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ChangeHistoryService } from '../change_history/change_history.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly db: DbService,
    private readonly history: ChangeHistoryService
  ) {}

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

    async update(id: number, dto: UpdateOrganizationDto) {
    // 1. Получаем старую запись
    const oldItem = await this.findOne(id);

    const keys = Object.keys(dto);
    if (keys.length === 0) return oldItem;

    const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map(key => (dto as any)[key] ?? null);

    const sql = `UPDATE organizations SET ${sets}, updated_at = NOW() WHERE id = $${keys.length + 1} AND deleted_at IS NULL RETURNING *;`;
    const result = await this.db.query(sql, [...values, id]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Организация с ID ${id} не найдена`);
    }

    // 2. Записываем историю
    for (const key of keys) {
      const oldVal = String(oldItem[key] ?? '');
      const newVal = String((dto as any)[key] ?? '');
      if (oldVal !== newVal) {
        await this.history.create({
          entity_type: 'organization',
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
    // Проверяем существование перед удалением
    await this.findOne(id);
    
    const sql = `UPDATE organizations SET deleted_at = NOW() WHERE id = $1;`;
    await this.db.query(sql, [id]);
    return { success: true };
  }
}