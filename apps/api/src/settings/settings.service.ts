import { Injectable } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";

@Injectable()
export class SettingsService {
  async getSettings() {
    const list = await prisma.setting.findMany();
    // Convert array of { key, value } to a single key-value object
    return list.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async updateSettings(settings: Record<string, string>) {
    const upserts = Object.entries(settings).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );
    await Promise.all(upserts);
    return this.getSettings();
  }
}
