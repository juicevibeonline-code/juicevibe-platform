import { apiClient } from "./api-client";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  createdAt: string;
}

export const galleryService = {
  async getImages(category?: string): Promise<GalleryImage[]> {
    const { data } = await apiClient.get("/gallery", { params: { category } });
    return data.data;
  },

  async uploadImage(file: File, title?: string, category?: string): Promise<GalleryImage> {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);
    if (category) formData.append("category", category);

    const { data } = await apiClient.post("/gallery/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data;
  },

  async updateImage(id: string, title?: string, category?: string): Promise<GalleryImage> {
    const { data } = await apiClient.patch(`/gallery/${id}`, { title, category });
    return data.data;
  },

  async deleteImage(id: string): Promise<void> {
    await apiClient.delete(`/gallery/${id}`);
  },
};
