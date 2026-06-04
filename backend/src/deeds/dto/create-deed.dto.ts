import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateDeedDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
