import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateChangeHistoryDto {
  @IsInt()
  @IsOptional()
  user_id?: number; // Кто сделал изменение (пока опционально)

  @IsString()
  @IsNotEmpty()
  entity_type: string; // Например: 'employee', 'organization'

  @IsInt()
  @IsNotEmpty()
  entity_id: number;

  @IsString()
  @IsNotEmpty()
  field_name: string; // Какое поле изменили

  @IsString()
  @IsOptional()
  old_value?: string;

  @IsString()
  @IsOptional()
  new_value?: string;
}