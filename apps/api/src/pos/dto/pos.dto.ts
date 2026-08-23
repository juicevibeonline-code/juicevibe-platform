import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, IsArray, Min, IsInt, ValidateNested, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export class PosOrderItemDto {
  @ApiProperty()
  @IsString()
  menuItemId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  variant?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addOnIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class PaymentTenderDto {
  @ApiProperty({ enum: ["cash", "card", "online"] })
  @IsString()
  method: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cardLast4?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionRef?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cashTendered?: number;
}

export class PosPaymentInputDto {
  @ApiProperty({ enum: ["cash", "card", "online"] })
  @IsString()
  method: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cashTendered?: number;

  @ApiPropertyOptional({ type: [PaymentTenderDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentTenderDto)
  splitTransactions?: PaymentTenderDto[];
}

export class CreatePosOrderDto {
  @ApiProperty({ enum: ["dine_in", "pickup", "delivery"] })
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tableId?: string;

  @ApiProperty({ type: [PosOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosOrderItemDto)
  items: PosOrderItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  serviceCharge?: number;

  @ApiPropertyOptional({ type: PosPaymentInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PosPaymentInputDto)
  payment?: PosPaymentInputDto;
}

export class SplitPaymentDto {
  @ApiProperty({ type: [PaymentTenderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentTenderDto)
  transactions: PaymentTenderDto[];
}

export class VoidItemDto {
  @ApiProperty()
  @IsString()
  orderItemId: string;

  @ApiProperty()
  @IsString()
  reason: string;
}

export class OpenShiftDto {
  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  openingFloat: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CloseShiftDto {
  @ApiProperty({ example: 25400 })
  @IsNumber()
  @Min(0)
  closingCash: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
