import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsEnum, IsNumber, IsOptional, IsDateString, Min } from "class-validator";
import { UserRole } from "@prisma/client";

export class CreateEmployeeDto {
  @ApiProperty({ example: "JVM-005" })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: "Kasun Perera" })
  @IsString()
  name: string;

  @ApiProperty({ example: "kasun@juicevibe.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Password123" })
  @IsString()
  password: string;

  @ApiProperty({ example: "cashier", enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: "Cashier" })
  @IsString()
  position: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salary?: number;

  @ApiPropertyOptional({ example: "2026-03-01T00:00:00.000Z" })
  @IsDateString()
  @IsOptional()
  hireDate?: string;
}

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ example: "Kasun Perera" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: "kasun@juicevibe.com" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: "newPassword123" })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: "cashier", enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ example: "Senior Cashier" })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salary?: number;

  @ApiPropertyOptional({ example: "2026-03-01T00:00:00.000Z" })
  @IsDateString()
  @IsOptional()
  hireDate?: string;
}
