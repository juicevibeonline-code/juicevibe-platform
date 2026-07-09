export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Regular Customer",
    avatar: "/avatars/avatar-1.jpg",
    rating: 5,
    text: "The Mango Magic smoothie is absolutely divine! Juice Vibe has become my go-to spot for fresh, healthy drinks. The ambiance is incredible too.",
  },
  {
    id: "2",
    name: "Rahul Verma",
    role: "Food Blogger",
    avatar: "/avatars/avatar-2.jpg",
    rating: 5,
    text: "Best juice bar in town! Their attention to quality and presentation is unmatched. The Berry Fusion is a must-try.",
  },
  {
    id: "3",
    name: "Ananya Patel",
    role: "Yoga Instructor",
    avatar: "/avatars/avatar-3.jpg",
    rating: 5,
    text: "I love their Green Detox after my morning yoga sessions. Fresh, organic, and packed with nutrition. Juice Vibe is a lifestyle brand!",
  },
  {
    id: "4",
    name: "Arjun Nair",
    role: "Fitness Trainer",
    avatar: "/avatars/avatar-4.jpg",
    rating: 4,
    text: "Finally a place that serves quality smoothies without added sugar. Their Avocado Smoothie is my post-workout ritual.",
  },
  {
    id: "5",
    name: "Neha Gupta",
    role: "College Student",
    avatar: "/avatars/avatar-5.jpg",
    rating: 5,
    text: "The Sunset Splash is literally the best drink I've ever had. Perfect Instagram-worthy presentation too!",
  },
];
