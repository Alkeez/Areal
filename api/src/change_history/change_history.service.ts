import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateChangeHistoryDto } from './dto/create-change-history.dto';

@Injectable()
export class ChangeHistoryService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateChangeHistoryDto) {
    const sql = `
      INSERT INTO change_history (user_id, entity_type, entity_id, field_name, old_value, new_value)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const params = [
      dto.user_id || null,
      dto.entity_type,
      dto.entity_id,
      dto.field_name,
      dto.old_value || null,
      dto.new_value || null,
    ];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

    async findAll(entityType?: string, entityId?: number) {
    let sql = `SELECT * FROM change_history WHERE 1=1`;
    const params: any[] = [];
    
    if (entityType) {
      params.push(entityType);
      sql += ` AND entity_type = $${params.length}`;
    }
    if (entityId) {
      params.push(entityId);
      sql += ` AND entity_id = $${params.length}`;
    }
    
    sql += ` ORDER BY created_at DESC;`;
    
    const result = await this.db.query(sql, params);
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(`SELECT * FROM change_history WHERE id = $1;`, [id]);
    if (!result.rows[0]) {
      throw new NotFoundException(`Запись истории с ID ${id} не найдена`);
    }
    return result.rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query(`DELETE FROM change_history WHERE id = $1;`, [id]);
    return { success: true };
  }
}