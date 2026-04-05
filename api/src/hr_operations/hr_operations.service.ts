import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateHrOperationDto } from './dto/create-hr-operation.dto';

@Injectable()
export class HrOperationsService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateHrOperationDto) {
    const sql = `
      INSERT INTO hr_operations (employee_id, operation_type, department_id, position_id, salary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    // Явно приводим undefined к null для корректной работы SQL
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

  async update(id: number, dto: CreateHrOperationDto) {
    await this.findOne(id);

    const sql = `
      UPDATE hr_operations SET
        employee_id = $1, operation_type = $2, department_id = $3, position_id = $4, salary = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;
    const params = [
      dto.employee_id,
      dto.operation_type,
      dto.department_id || null,
      dto.position_id || null,
      dto.salary || null,
      id,
    ];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query(`UPDATE hr_operations SET deleted_at = NOW() WHERE id = $1;`, [id]);
    return { success: true };
  }
}