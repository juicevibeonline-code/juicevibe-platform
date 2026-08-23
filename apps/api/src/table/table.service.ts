import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import * as QRCode from "qrcode";
import { CreateTableDto } from "./dto/create-table.dto";

@Injectable()
export class TableService {
  private getFrontendUrl(): string {
    const baseUrl =
      process.env.FRONTEND_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://juice-vibe-waskaduwa-web.vercel.app"
        : "http://localhost:3000");
    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }

  async createTable(input: CreateTableDto) {
    const existing = await prisma.table.findUnique({ where: { number: input.number } });
    if (existing) {
      throw new ConflictException(`Table number ${input.number} already exists`);
    }

    // Temporarily save table to generate an ID
    const table = await prisma.table.create({
      data: {
        number: input.number,
        qrCodeUrl: "", // Temp empty URL, updated below
      },
    });

    const cleanBaseUrl = this.getFrontendUrl();
    const qrUrl = `${cleanBaseUrl}/menu?tableId=${table.id}`;

    try {
      // Generate base64 Data URI of QR code image
      const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 400,
        color: {
          dark: "#0F2A1E",
          light: "#FFFFFF",
        },
      });

      // Update table with actual generated QR code URL
      return await prisma.table.update({
        where: { id: table.id },
        data: { qrCodeUrl: qrCodeDataUrl },
      });
    } catch (err) {
      // Cleanup table if QR generation fails
      await prisma.table.delete({ where: { id: table.id } });
      throw err;
    }
  }

  async regenerateQRCodes() {
    const tables = await prisma.table.findMany();
    const cleanBaseUrl = this.getFrontendUrl();

    for (const table of tables) {
      const qrUrl = `${cleanBaseUrl}/menu?tableId=${table.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 400,
        color: {
          dark: "#0F2A1E",
          light: "#FFFFFF",
        },
      });
      await prisma.table.update({
        where: { id: table.id },
        data: { qrCodeUrl: qrCodeDataUrl },
      });
    }

    return this.getTables();
  }

  async getTables() {
    return prisma.table.findMany({
      include: {
        orders: {
          where: {
            status: { in: ["pending", "confirmed", "preparing", "ready"] },
          },
          include: {
            items: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { number: "asc" },
    });
  }

  async updateTableStatus(id: string, status: string) {
    await this.getTable(id);
    return prisma.table.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async getTable(id: string) {
    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        orders: {
          where: {
            status: { in: ["pending", "confirmed", "preparing", "ready"] },
          },
          include: {
            items: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    if (!table) throw new NotFoundException(`Table with ID ${id} not found`);
    return table;
  }

  async deleteTable(id: string) {
    await this.getTable(id);
    return prisma.table.delete({ where: { id } });
  }
}


