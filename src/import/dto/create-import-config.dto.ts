import { IsString, IsNumber, IsArray, IsOptional, IsBoolean, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ColumnMapping } from '../entities/import-config.entity';

class ColumnMappingDto implements ColumnMapping {
  @IsNumber()
  @Min(1)
  columnIndex: number;

  @IsString()
  fieldName: string;
}

export class CreateImportConfigDto {
  @IsString()
  name: string;

  @IsString()
  microservice: string;

  @IsString()
  schema: string;

  @IsString()
  table: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  skipRows?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  startColumn?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnMappingDto)
  columnMappings?: ColumnMappingDto[];

  @IsOptional()
  @IsString()
  delimiter?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
