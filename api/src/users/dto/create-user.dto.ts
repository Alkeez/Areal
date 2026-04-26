import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  surname!: string;

  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsOptional()
  patronymic?: string;

  @IsString()
  @IsNotEmpty()
  login!: string;

  @IsString()
  @IsNotEmpty()
  password!: string; // Пароль в открытом виде при создании

  @IsString()
  @IsIn(['admin', 'hr_manager'])
  role!: 'admin' | 'hr_manager';
}