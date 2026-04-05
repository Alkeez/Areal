import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty({ message: 'Название должности не может быть пустым' })
  name: string;
}