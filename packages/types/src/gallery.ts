export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  isVideo: boolean;
  videoSrc?: string;
  blurhash?: string;
  createdAt: string;
}

export interface GalleryAlbum {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  images: GalleryImage[];
  order: number;
}
