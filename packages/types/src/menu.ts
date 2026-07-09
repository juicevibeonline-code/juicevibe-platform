export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image?: string;
  order: number;
  status: import("./common").Status;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  category?: MenuCategory;
  images: string[];
  thumbnail?: string;
  availability: import("./common").Availability;
  isPopular: boolean;
  isFeatured: boolean;
  calories?: number;
  ingredients: string[];
  tags: string[];
  variants: ItemVariant[];
  addOns: AddOn[];
  order: number;
  status: import("./common").Status;
  createdAt: string;
  updatedAt: string;
}

export interface ItemVariant {
  id: string;
  name: string;
  priceAdjustment: number;
  isDefault: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

export interface CreateMenuItemInput {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images?: string[];
  calories?: number;
  ingredients?: string[];
  tags?: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
  variants?: Omit<ItemVariant, "id">[];
  addOns?: Omit<AddOn, "id">[];
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon: string;
  image?: string;
  order?: number;
}
