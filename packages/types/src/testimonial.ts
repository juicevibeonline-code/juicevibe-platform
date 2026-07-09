export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  text: string;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateTestimonialInput {
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  text: string;
}
