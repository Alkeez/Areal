import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateEmployeeDto {
  // ФИО
  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  patronymic?: string;

  @IsDateString()
  @IsOptional()
  birth_date?: string;

  // Паспорт
  @IsString()
  @IsOptional()
  passport_series?: string;

  @IsString()
  @IsOptional()
  passport_number?: string;

  @IsDateString()
  @IsOptional()
  passport_issue_date?: string;

  @IsString()
  @IsOptional()
  passport_div_code?: string;

  @IsString()
  @IsOptional()
  passport_issued_by?: string;

  // Адрес регистрации
  @IsString()
  @IsOptional()
  reg_region?: string;

  @IsString()
  @IsOptional()
  reg_city?: string;

  @IsString()
  @IsOptional()
  reg_street?: string;

  @IsString()
  @IsOptional()
  reg_house?: string;

  @IsString()
  @IsOptional()
  reg_building?: string;

  @IsString()
  @IsOptional()
  reg_apartment?: string;
}