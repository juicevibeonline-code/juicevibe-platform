import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import { slugify } from "@juice-vibe/utils";

@Injectable()
export class MenuService {
  async getCategories() {
    return prisma.category.findMany({
      where: { status: "active" },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { items: { where: { status: "active" } } } },
      },
    });
  }

  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { items: true } } },
    });
  }

  async createCategory(input: { name: string; description?: string; icon: string; image?: string; order?: number }) {
    const slug = slugify(input.name);
    return prisma.category.create({
      data: { ...input, slug },
    });
  }

  async updateCategory(id: string, input: Partial<{ name: string; description: string; icon: string; image: string; order: number; status: string }>) {
    const data: any = { ...input };
    if (input.name) data.slug = slugify(input.name);
    return prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({ where: { id } });
  }

  async getMenuItems(params: { category?: string; search?: string; popular?: boolean; featured?: boolean; page?: number; limit?: number }) {
    const where: any = { status: "active" };

    if (params.category && params.category !== "all") {
      where.category = { slug: params.category };
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }
    if (params.popular) where.isPopular = true;
    if (params.featured) where.isFeatured = true;

    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        include: { category: true, variants: true, addOns: true },
        orderBy: [{ isPopular: "desc" }, { order: "asc" }],
        skip,
        take: limit,
      }),
      prisma.menuItem.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getMenuItem(id: string) {
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true, variants: true, addOns: true },
    });
    if (!item) throw new NotFoundException("Menu item not found");
    return item;
  }

  async createMenuItem(input: {
    name: string; description: string; price: number; categoryId: string;
    images?: string[]; calories?: number; ingredients?: string[]; tags?: string[];
    isPopular?: boolean; isFeatured?: boolean;
    variants?: { name: string; priceAdjustment: number; isDefault: boolean }[];
    addOns?: { name: string; price: number; category: string }[];
  }) {
    const slug = slugify(input.name);
    const { variants, addOns, ...itemData } = input;

    return prisma.menuItem.create({
      data: {
        ...itemData,
        slug,
        ingredients: itemData.ingredients || [],
        tags: itemData.tags || [],
        images: itemData.images || [],
        variants: variants ? { create: variants } : undefined,
        addOns: addOns ? { create: addOns } : undefined,
      },
      include: { category: true, variants: true, addOns: true },
    });
  }

  async updateMenuItem(id: string, input: any) {
    const item = await prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Menu item not found");

    const { variants, addOns, ...data } = input;
    if (data.name) data.slug = slugify(data.name);

    return prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        ...(variants ? { variants: { deleteMany: {}, create: variants } } : {}),
        ...(addOns ? { addOns: { deleteMany: {}, create: addOns } } : {}),
      },
      include: { category: true, variants: true, addOns: true },
    });
  }

  async deleteMenuItem(id: string) {
    return prisma.menuItem.delete({ where: { id } });
  }

  async reorderItems(items: { id: string; order: number }[]) {
    await Promise.all(
      items.map((item) => prisma.menuItem.update({ where: { id: item.id }, data: { order: item.order } }))
    );
  }
}
