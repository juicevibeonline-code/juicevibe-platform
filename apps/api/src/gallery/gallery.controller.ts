import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { GalleryService } from "./gallery.service";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";
import { FileInterceptor } from "@nestjs/platform-express";

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

  @Post("upload")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager", "editor")
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload file and add to gallery" })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body("title") title?: string,
    @Body("category") category?: string,
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new BadRequestException("File size exceeds 10MB limit");
    }

    // Validate mime type (images only)
    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Only image files are allowed");
    }

    const image = await this.galleryService.uploadAndCreate({
      file,
      title: title || file.originalname,
      category: category || "general",
    });

    return ApiResponseDto.ok(image, "Image uploaded successfully");
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "editor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update/Rename gallery image" })
  async updateImage(@Param("id") id: string, @Body() body: { title?: string; category?: string }) {
    const image = await this.galleryService.updateImage(id, body);
    return ApiResponseDto.ok(image, "Image updated successfully");
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
