export const validators = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value: string) => /^\+?[\d\s-]{7,15}$/.test(value),
  url: (value: string) => /^https?:\/\/.+/.test(value),
  required: (value: string) => value.trim().length > 0,
  minLength: (min: number) => (value: string) => value.length >= min,
  maxLength: (max: number) => (value: string) => value.length <= max,
  password: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
  positiveNumber: (value: number) => value > 0,
  between: (min: number, max: number) => (value: number) => value >= min && value <= max,
};
