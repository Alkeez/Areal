import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateFileDto {
  @IsInt()
  @IsNotEmpty({ message: 'ID сотрудника обязателен' })
  employee_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Имя файла не может быть пустым' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Путь к файлу не может быть пустым' })
  path: string;
}