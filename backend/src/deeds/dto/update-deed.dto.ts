import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateDeedDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
