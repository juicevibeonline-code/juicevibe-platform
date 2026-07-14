import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import * as QRCode from "qrcode";
import { CreateTableDto } from "./dto/create-table.dto";

@Injectable()
export class TableService {
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

    const baseUrl = process.env.FRONTEND_URL || "https://juicevibe.com";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const qrUrl = `${cleanBaseUrl}/menu?tableId=${table.id}`;

    try {
      // Generate base64 Data URI of QR code image
      const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 300,
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

  async getTables() {
    return prisma.table.findMany({
      orderBy: { number: "asc" },
    });
  }

  async getTable(id: string) {
    const table = await prisma.table.findUnique({ where: { id } });
    if (!table) throw new NotFoundException(`Table with ID ${id} not found`);
    return table;
  }
}
