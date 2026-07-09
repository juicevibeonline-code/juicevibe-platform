import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { TestimonialsService } from "./testimonials.service";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Testimonials")
@Controller("testimonials")
export class TestimonialsController {
  constructor(private testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({ summary: "Get approved testimonials" })
  async getTestimonials(@Query("featured") featured?: string) {
    const testimonials = await this.testimonialsService.getTestimonials(featured === "true");
    return ApiResponseDto.ok(testimonials);
  }

  @Get("all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all testimonials (admin)" })
  async getAll(@Query("page") page?: number, @Query("limit") limit?: number) {
    const result = await this.testimonialsService.getAllTestimonials({ page: Number(page) || 1, limit: Number(limit) || 20 });
    return ApiResponseDto.paginated(result.testimonials, result.total, result.page, result.limit);
  }

  @Post()
  @ApiOperation({ summary: "Submit a testimonial" })
  async create(@Body() body: any) {
    const testimonial = await this.testimonialsService.create(body);
    return ApiResponseDto.ok(testimonial, "Testimonial submitted for review");
  }

  @Patch(":id/approve")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Approve a testimonial" })
  async approve(@Param("id") id: string) {
    await this.testimonialsService.approve(id);
    return ApiResponseDto.ok(null, "Testimonial approved");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a testimonial" })
  async delete(@Param("id") id: string) {
    await this.testimonialsService.delete(id);
    return ApiResponseDto.ok(null, "Testimonial deleted");
  }
}
