import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";

@Injectable()
export class GalleryService {
  async getImages(category?: string) {
    const where: any = {};
    if (category) where.category = category;
    return prisma.galleryImage.findMany({
      where,
      include: { album: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAlbums() {
    return prisma.galleryAlbum.findMany({
      include: { _count: { select: { images: true } } },
      orderBy: { order: "asc" },
    });
  }

  async createImage(input: { src: string; alt: string; width: number; height: number; category?: string; albumId?: string }) {
    return prisma.galleryImage.create({ data: input });
  }

  async deleteImage(id: string) {
    return prisma.galleryImage.delete({ where: { id } });
  }
}
