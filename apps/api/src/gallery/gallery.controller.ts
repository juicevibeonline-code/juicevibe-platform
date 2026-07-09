import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { GalleryService } from "./gallery.service";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Gallery")
@Controller("gallery")
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Get()
  @ApiOperation({ summary: "Get gallery images" })
  async getImages(@Query("category") category?: string) {
    const images = await this.galleryService.getImages(category);
    return ApiResponseDto.ok(images);
  }

  @Get("albums")
  @ApiOperation({ summary: "Get gallery albums" })
  async getAlbums() {
    const albums = await this.galleryService.getAlbums();
    return ApiResponseDto.ok(albums);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add gallery image" })
  async createImage(@Body() body: any) {
    const image = await this.galleryService.createImage(body);
    return ApiResponseDto.ok(image, "Image added");
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete gallery image" })
  async deleteImage(@Param("id") id: string) {
    await this.galleryService.deleteImage(id);
    return ApiResponseDto.ok(null, "Image deleted");
  }
}
