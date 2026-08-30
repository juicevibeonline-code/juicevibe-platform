export interface BlogPostAuthor {
  name: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author?: BlogPostAuthor | string;
  tags: string[];
  category: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogInput {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  tags?: string[];
  category: string;
  isPublished?: boolean;
}
