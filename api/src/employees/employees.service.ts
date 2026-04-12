import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/create-employee.dto';
import { ChangeHistoryService } from '../change_history/change_history.service'; // Импорт

@Injectable()
export class EmployeesService {
  constructor(
    private readonly db: DbService,
    private readonly history: ChangeHistoryService, // Инжектируем историю
  ) {}

  async create(dto: CreateEmployeeDto) {
    const sql = `
      INSERT INTO employees (
        surname, first_name, patronymic, birth_date, 
        passport_series, passport_number, passport_issue_date, passport_div_code, passport_issued_by,
        reg_region, reg_city, reg_street, reg_house, reg_building, reg_apartment
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;
    const params = [
      dto.surname, dto.first_name, dto.patronymic, dto.birth_date,
      dto.passport_series, dto.passport_number, dto.passport_issue_date, dto.passport_div_code, dto.passport_issued_by,
      dto.reg_region, dto.reg_city, dto.reg_street, dto.reg_house, dto.reg_building, dto.reg_apartment
    ];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  async findAll(search?: string) {
    let sql = `SELECT * FROM employees WHERE deleted_at IS NULL`;
    // Явно указываем тип массива, чтобы TypeScript не ругался
    const params: any[] = []; 

    if (search) {
      sql += ` AND (surname ILIKE $1 OR first_name ILIKE $1 OR patronymic ILIKE $1)`;
      params.push(`%${search}%`);
    }
    
    sql += ` ORDER BY id DESC;`;
    
    const result = await this.db.query(sql, params);
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(`SELECT * FROM employees WHERE id = $1 AND deleted_at IS NULL;`, [id]);
    if (!result.rows[0]) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }
    return result.rows[0];
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    // Получаем старую запись
    const oldEmployee = await this.findOne(id);

    // Формируем динамический SQL для обновления только переданных полей
    const keys = Object.keys(dto);
    if (keys.length === 0) return oldEmployee; // Нечего обновлять

    const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(dto);
    
    const sql = `UPDATE employees SET ${sets}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *;`;
    
    const result = await this.db.query(sql, [...values, id]);

    // Исправление ошибки 4: Автоматическая запись истории
    // Сравниваем старое и новое, пишем изменения
    for (const key of keys) {
        const oldVal = String(oldEmployee[key] || '');
        const newVal = String((dto as any)[key] || '');
        if (oldVal !== newVal) {
            await this.history.create({
                entity_type: 'employee',
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
    await this.db.query(`UPDATE employees SET deleted_at = NOW() WHERE id = $1;`, [id]);
    return { success: true };
  }
}