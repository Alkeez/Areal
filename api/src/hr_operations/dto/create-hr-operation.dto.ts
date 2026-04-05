import { IsString, IsNotEmpty, IsInt, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateHrOperationDto {
  @IsInt()
  @IsNotEmpty({ message: 'ID сотрудника обязателен' })
  employee_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Тип операции обязателен' })
  operation_type: string; // hiring, firing, salary_change, department_change

  @IsInt()
  @IsOptional()
  department_id?: number;

  @IsInt()
  @IsOptional()
  position_id?: number;

  @IsNumber()
  @IsOptional()
  salary?: number;
}