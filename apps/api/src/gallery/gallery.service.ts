import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

@Injectable()
export class GalleryService {
  constructor() {
    if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith("cloudinary://")) {
      delete process.env.CLOUDINARY_URL;
    }
    // Configure Cloudinary if credentials are provided in env
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }

  async getImages(category?: string) {
    const where: any = {};
    if (category && category !== "all") where.category = category;
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

  async uploadAndCreate(input: { file: Express.Multer.File; title: string; category?: string }) {
    const { file, title, category } = input;
    let src = "";

    // 1. Check if Cloudinary is configured
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: "juice-vibe-gallery" }, (error, res) => {
            if (error) reject(error);
            else resolve(res);
          }).end(file.buffer);
        });
        src = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed, falling back to local storage:", err);
      }
    }

    // 2. Fallback to Local Disk Storage
    if (!src) {
      const uploadDir = join(process.cwd(), "public", "uploads");
      // Ensure path exists
      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueSuffix = randomBytes(4).toString("hex");
      // Clean up filename to prevent path traversal
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${uniqueSuffix}-${safeName}`;
      const filePath = join(uploadDir, fileName);

      await fs.writeFile(filePath, file.buffer);

      // Construct server URL
      const apiHost = process.env.API_URL || "http://localhost:4000";
      src = `${apiHost}/uploads/${fileName}`;
    }

    // 3. Create database record
    return prisma.galleryImage.create({
      data: {
        src,
        alt: title,
        width: 800,
        height: 600,
        category: category || "general",
      },
    });
  }

  async updateImage(id: string, input: { title?: string; category?: string }) {
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Image not found");
    }

    return prisma.galleryImage.update({
      where: { id },
      data: {
        alt: input.title !== undefined ? input.title : undefined,
        category: input.category !== undefined ? input.category : undefined,
      },
    });
  }

  async deleteImage(id: string) {
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Image not found");
    }
    return prisma.galleryImage.delete({ where: { id } });
  }
}
