import { Injectable } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";

@Injectable()
export class TestimonialsService {
  async getTestimonials(featured?: boolean) {
    const where: any = { isApproved: true };
    if (featured) where.isFeatured = true;
    return prisma.testimonial.findMany({
      where,
      orderBy: featured ? [{ isFeatured: "desc" }, { createdAt: "desc" }] : { createdAt: "desc" },
    });
  }

  async getAllTestimonials(params: { page?: number; limit?: number; isApproved?: boolean }) {
    const where: any = {};
    if (params.isApproved !== undefined) where.isApproved = params.isApproved;

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.testimonial.count({ where }),
    ]);
    return { testimonials, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(input: { name: string; role?: string; avatar?: string; rating: number; text: string }) {
    return prisma.testimonial.create({ data: input });
  }

  async approve(id: string) {
    return prisma.testimonial.update({ where: { id }, data: { isApproved: true } });
  }

  async update(id: string, input: { isApproved?: boolean; isFeatured?: boolean; name?: string; role?: string; avatar?: string; rating?: number; text?: string }) {
    return prisma.testimonial.update({ where: { id }, data: input });
  }

  async delete(id: string) {
    return prisma.testimonial.delete({ where: { id } });
  }
}
