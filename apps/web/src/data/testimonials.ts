export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Amara Fernando",
    role: "Regular Customer, Colombo",
    rating: 5,
    text: "The Mango Magic smoothie is absolutely divine! Juice Vibe has become my go-to spot for fresh, healthy drinks in Colombo. The ambiance is incredible too.",
  },
  {
    id: "2",
    name: "Kavindu Perera",
    role: "Food Blogger, Kandy",
    rating: 5,
    text: "Best juice bar in Sri Lanka! Their attention to quality and presentation is unmatched. The Berry Bliss is a must-try for everyone.",
  },
  {
    id: "3",
    name: "Nipuni Silva",
    role: "Yoga Instructor, Galle",
    rating: 5,
    text: "I love their Fresh Lime cooler after my morning yoga sessions. Fresh, organic, and packed with nutrition. Juice Vibe is a lifestyle brand!",
  },
  {
    id: "4",
    name: "Tharaka Wickramasinghe",
    role: "Fitness Trainer, Negombo",
    rating: 5,
    text: "Finally a place that serves quality smoothies without added sugar. Their Strawberry Bliss is my post-workout ritual. Highly recommend!",
  },
  {
    id: "5",
    name: "Dilini Ranasinghe",
    role: "College Student, Matara",
    rating: 5,
    text: "The Tropical Mango is literally the best drink I've ever had. Perfect Instagram-worthy presentation too! Love this place.",
  },
];
