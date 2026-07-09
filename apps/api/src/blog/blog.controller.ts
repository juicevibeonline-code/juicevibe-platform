import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { CurrentUser } from "../common/decorators";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Blog")
@Controller("blog")
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: "Get published blog posts" })
  async getPosts(@Query("category") category?: string, @Query("page") page?: number, @Query("limit") limit?: number) {
    const result = await this.blogService.getPosts({ published: true, category, page: Number(page) || 1, limit: Number(limit) || 20 });
    return ApiResponseDto.paginated(result.posts, result.total, result.page, result.limit);
  }

  @Get("all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all posts (admin)" })
  async getAllPosts(@Query("page") page?: number, @Query("limit") limit?: number) {
    const result = await this.blogService.getPosts({ page: Number(page) || 1, limit: Number(limit) || 20 });
    return ApiResponseDto.paginated(result.posts, result.total, result.page, result.limit);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get blog post by slug" })
  async getPost(@Param("slug") slug: string) {
    const post = await this.blogService.getPost(slug);
    return ApiResponseDto.ok(post);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a blog post" })
  async createPost(@Body() body: any, @CurrentUser("sub") authorId: string) {
    const post = await this.blogService.createPost({ ...body, authorId });
    return ApiResponseDto.ok(post, "Post created");
  }

  @Patch(":id/publish")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Publish a blog post" })
  async publishPost(@Param("id") id: string) {
    const post = await this.blogService.publishPost(id);
    return ApiResponseDto.ok(post, "Post published");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a blog post" })
  async deletePost(@Param("id") id: string) {
    await this.blogService.deletePost(id);
    return ApiResponseDto.ok(null, "Post deleted");
  }
}
