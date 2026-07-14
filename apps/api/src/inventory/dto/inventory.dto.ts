import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, IsDateString, Min } from "class-validator";

export class CreateInventoryDto {
  @ApiProperty({ example: "Mango Pulp", description: "The name of the inventory item" })
  @IsString()
  name: string;

  @ApiProperty({ example: 10.5, description: "The current quantity of the item" })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: "kg", description: "The unit of measurement" })
  @IsString()
  unit: string;

  @ApiProperty({ example: 5, description: "Minimum quantity before triggering alert" })
  @IsNumber()
  @Min(0)
  minStockLevel: number;

  @ApiPropertyOptional({ example: "Ceylon Fruits Ltd", description: "Supplier name" })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiPropertyOptional({ example: "2026-08-10T00:00:00.000Z", description: "Expiry date" })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}

export class UpdateInventoryDto {
  @ApiPropertyOptional({ example: "Mango Pulp" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 12.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ example: "kg" })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minStockLevel?: number;

  @ApiPropertyOptional({ example: "Ceylon Fruits Ltd" })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiPropertyOptional({ example: "2026-08-10T00:00:00.000Z" })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}
