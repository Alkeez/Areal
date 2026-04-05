import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly db: DbService) {}

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

  async findAll() {
    const result = await this.db.query(`SELECT * FROM employees WHERE deleted_at IS NULL ORDER BY id DESC;`);
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(`SELECT * FROM employees WHERE id = $1 AND deleted_at IS NULL;`, [id]);
    if (!result.rows[0]) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }
    return result.rows[0];
  }

  async update(id: number, dto: CreateEmployeeDto) {
    await this.findOne(id); // Проверка существования
    
    const sql = `
      UPDATE employees SET
        surname = $1, first_name = $2, patronymic = $3, birth_date = $4,
        passport_series = $5, passport_number = $6, passport_issue_date = $7, passport_div_code = $8, passport_issued_by = $9,
        reg_region = $10, reg_city = $11, reg_street = $12, reg_house = $13, reg_building = $14, reg_apartment = $15,
        updated_at = NOW()
      WHERE id = $16
      RETURNING *;
    `;
    const params = [
      dto.surname, dto.first_name, dto.patronymic, dto.birth_date,
      dto.passport_series, dto.passport_number, dto.passport_issue_date, dto.passport_div_code, dto.passport_issued_by,
      dto.reg_region, dto.reg_city, dto.reg_street, dto.reg_house, dto.reg_building, dto.reg_apartment,
      id
    ];
    const result = await this.db.query(sql, params);
    return result.rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query(`UPDATE employees SET deleted_at = NOW() WHERE id = $1;`, [id]);
    return { success: true };
  }
}