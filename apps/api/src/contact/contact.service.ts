import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";

@Injectable()
export class ContactService {
  async submitMessage(input: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return prisma.contactMessage.create({ data: input });
  }

  async getMessages(params: { isRead?: boolean; page?: number; limit?: number }) {
    const where: any = {};
    if (params.isRead !== undefined) where.isRead = params.isRead;

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.contactMessage.count({ where }),
    ]);

    return { messages, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(id: string) {
    return prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  }

  async deleteMessage(id: string) {
    return prisma.contactMessage.delete({ where: { id } });
  }

  async subscribe(email: string) {
    return prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });
  }

  async getSubscribers(params?: { page?: number; limit?: number }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.newsletterSubscriber.count(),
    ]);

    return { subscribers, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async toggleSubscriber(id: string) {
    const sub = await prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!sub) throw new NotFoundException("Subscriber not found");
    return prisma.newsletterSubscriber.update({
      where: { id },
      data: { isActive: !sub.isActive },
    });
  }

  async deleteSubscriber(id: string) {
    const sub = await prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!sub) throw new NotFoundException("Subscriber not found");
    return prisma.newsletterSubscriber.delete({ where: { id } });
  }
}

