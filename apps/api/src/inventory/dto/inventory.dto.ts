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

export class RecipeIngredientInputDto {
  @ApiProperty({ example: "inv_123" })
  @IsString()
  inventoryItemId: string;

  @ApiProperty({ example: 0.15, description: "Quantity in ingredient's base unit" })
  @IsNumber()
  @Min(0.0001)
  quantity: number;

  @ApiPropertyOptional({ example: 0.05, description: "Wastage factor percentage" })
  @IsNumber()
  @IsOptional()
  @Min(0)
  wastageFactor?: number;
}

export class SaveRecipeDto {
  @ApiProperty({ example: "item_123" })
  @IsString()
  menuItemId: string;

  @ApiPropertyOptional({ example: 1.0 })
  @IsNumber()
  @IsOptional()
  @Min(0.1)
  yieldServings?: number;

  @ApiProperty({ type: [RecipeIngredientInputDto] })
  ingredients: RecipeIngredientInputDto[];
}

export class StockMovementDto {
  @ApiProperty({ example: "inv_123" })
  @IsString()
  inventoryItemId: string;

  @ApiProperty({ example: "PURCHASE", enum: ["PURCHASE", "WASTAGE", "ADJUSTMENT", "TRANSFER", "RETURN"] })
  @IsString()
  type: string;

  @ApiProperty({ example: 5.0, description: "Quantity to add (positive) or deduct" })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ example: 250.0, description: "Unit purchase cost in LKR" })
  @IsNumber()
  @IsOptional()
  unitCost?: number;

  @ApiPropertyOptional({ example: "PO-8942" })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiPropertyOptional({ example: "Supplier batch delivery" })
  @IsString()
  @IsOptional()
  notes?: string;
}

