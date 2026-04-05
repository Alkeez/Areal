import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateDepartmentDto {
  @IsInt()
  @IsNotEmpty({ message: 'ID организации обязателен' })
  organization_id: number;

  @IsInt()
  @IsOptional()
  parent_id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Название отдела не может быть пустым' })
  name: string;

  @IsString()
  @IsOptional()
  comment?: string;
}