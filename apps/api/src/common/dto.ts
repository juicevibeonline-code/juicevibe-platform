import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, Min } from "class-validator";

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}

export class ApiResponseDto<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: { page: number; limit: number; total: number; totalPages: number };

  static ok<T>(data: T, message?: string): ApiResponseDto<T> {
    return { success: true, data, message };
  }

  static error(error: string): ApiResponseDto<never> {
    return { success: false, error };
  }

  static paginated<T>(data: T[], total: number, page: number, limit: number): ApiResponseDto<T[]> {
    return {
      success: true,
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
