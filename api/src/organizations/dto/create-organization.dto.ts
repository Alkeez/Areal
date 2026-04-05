import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty({ message: 'Название организации не может быть пустым' })
  name: string;

  @IsString()
  @IsOptional()
  comment?: string;
}