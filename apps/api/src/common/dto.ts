import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsEmail, Min, MinLength, MaxLength, IsInt, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

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

export class RegisterDto {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: "+94711234567" })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginDto {
  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  password: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class OrderItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  menuItemId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsInt()
  @Min(1, { message: "Quantity must be at least 1" })
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ enum: ["delivery", "pickup", "dine_in"] })
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  customerName: string;

  @ApiProperty()
  @IsString()
  customerPhone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: ["cash", "card", "online"] })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tableId?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"] })
  @IsString()
  status: string;
}

export class UpdateOrderPaymentStatusDto {
  @ApiProperty({ enum: ["pending", "paid", "refunded", "failed"] })
  @IsString()
  status: string;
}

export class CreateMenuItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ enum: ["in_stock", "out_of_stock", "coming_soon"] })
  @IsOptional()
  @IsString()
  availability?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  variants?: { name: string; priceAdjustment: number; isDefault: boolean }[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  addOns?: { name: string; price: number; category: string; isAvailable: boolean }[];
}

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  icon: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ enum: ["percentage", "fixed"] })
  @IsString()
  type: "percentage" | "fixed";

  @ApiProperty()
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expiresAt?: string;
}

export class CreateTestimonialDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsString()
  text: string;
}

export class CreateContactMessageDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  message: string;
}

export class SubscribeDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ReorderItemsDto {
  @ApiProperty()
  items: { id: string; order: number }[];
}

export class CreateBlogPostDto {
  @ApiProperty({ example: "5 Morning Juices For Infinite Energy" })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: "Discover the best cold-pressed juices to kickstart your day." })
  @IsString()
  excerpt: string;

  @ApiProperty({ example: "Full blog content here..." })
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ type: [String], example: ["health", "morning", "juices"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: "Health" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateBlogPostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

