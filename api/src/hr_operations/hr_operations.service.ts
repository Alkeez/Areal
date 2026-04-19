import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';
import { UpdateHrOperationDto } from './dto/update-hr-operation.dto';

@Injectable()
export class HrOperationsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateHrOperationDto) {
    const sql = `
      INSERT INTO hr_operations (employee_id, operation_type, department_id, position_id, salary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const params = [
      dto.employee_id,
      dto.operation_type,
      dto.department_id || null,
      dto.position_id || null,
      dto.salary || null,
    ];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.db.query(`SELECT * FROM hr_operations WHERE deleted_at IS NULL ORDER BY created_at DESC;`);
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(`SELECT * FROM hr_operations WHERE id = $1 AND deleted_at IS NULL;`, [id]);
    if (!result.rows[0]) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена`);
    }
    return result.rows[0];
  }

  // Исправлено: убран лишний findOne, используется UpdateDto
  async update(id: number, dto: UpdateHrOperationDto) {
    const keys = Object.keys(dto);
    if (keys.length === 0) return this.findOne(id); // Если пустой DTO, просто возвращаем запись

    const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map(key => (dto as any)[key] ?? null);

    const sql = `
      UPDATE hr_operations SET ${sets}, updated_at = NOW()
      WHERE id = $${keys.length + 1} AND deleted_at IS NULL
      RETURNING *;
    `;
    
    const result = await this.db.query(sql, [...values, id]);

    if (!result.rows[0]) {
      throw new NotFoundException(`Кадровая операция с ID ${id} не найдена или удалена`);
    }
    return result.rows[0];
  }

  async remove(id: number) {
    // Здесь findOne нужен, чтобы вернуть 404 если уже удалено
    await this.findOne(id);
    await this.db.query(`UPDATE hr_operations SET deleted_at = NOW() WHERE id = $1;`, [id]);
    return { success: true };
  }
}