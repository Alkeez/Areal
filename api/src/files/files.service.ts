import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateFileDto) {
    // Можно добавить проверку, существует ли сотрудник, но для простоты пока опустим
    const sql = `
      INSERT INTO files (employee_id, name, path)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await this.db.query(sql, [dto.employee_id, dto.name, dto.path]);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.db.query(`SELECT * FROM files WHERE deleted_at IS NULL;`);
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.db.query(`SELECT * FROM files WHERE id = $1 AND deleted_at IS NULL;`, [id]);
    if (!result.rows[0]) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }
    return result.rows[0];
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.db.query(`UPDATE files SET deleted_at = NOW() WHERE id = $1;`, [id]);
    return { success: true };
  }
}