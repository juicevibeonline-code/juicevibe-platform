import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import { slugify } from "@juice-vibe/utils";

@Injectable()
export class BlogService {
  async getPosts(params: { published?: boolean; category?: string; page?: number; limit?: number }) {
    const where: any = {};
    if (params.published) where.isPublished = true;
    if (params.category) where.category = params.category;

    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { author: { select: { name: true, avatar: true } } },
        orderBy: params.published ? { publishedAt: "desc" } : { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);
    return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPost(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { name: true, avatar: true } } },
    });
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  async createPost(input: { title: string; excerpt: string; content: string; coverImage?: string; authorId: string; tags?: string[]; category?: string }) {
    const slug = slugify(input.title);
    return prisma.blogPost.create({
      data: { ...input, slug, tags: input.tags || [], category: input.category || "general" },
      include: { author: { select: { name: true, avatar: true } } },
    });
  }

  async publishPost(id: string) {
    return prisma.blogPost.update({
      where: { id },
      data: { isPublished: true, publishedAt: new Date() },
    });
  }

  async deletePost(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  }
}
