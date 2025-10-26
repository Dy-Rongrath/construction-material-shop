import { z } from 'zod';

// Enhanced password validation with security requirements
const securePasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

// Sanitization functions for security
export const sanitizers = {
  html: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  sql: (input: string): string => {
    return input.replace(/['";\\]/g, '');
  },

  filename: (input: string): string => {
    return input.replace(/[^a-zA-Z0-9._-]/g, '_');
  },

  general: (input: string): string => {
    return input.trim().substring(0, 10000); // Reasonable length limit
  },
};

// Input validation helper
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  sanitizeFields: (keyof T)[] = []
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    // Sanitize specified fields
    const sanitizedData = data && typeof data === 'object' ? { ...data } : {};
    sanitizeFields.forEach(field => {
      if (typeof (sanitizedData as any)[field] === 'string') {
        (sanitizedData as any)[field] = sanitizers.general((sanitizedData as any)[field]);
      }
    });

    const validData = schema.parse(sanitizedData);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
    password: securePasswordSchema,
    confirmPassword: z.string(),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50)
      .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
      .trim(),
    acceptTerms: z
      .boolean()
      .refine(val => val === true, 'You must accept the terms and conditions'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Product schemas
export const productFilterSchema = z.object({
  search: z.string().optional(),
  categories: z.array(z.string()).optional(),
  brands: z.array(z.string()).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: z.enum(['name', 'price-asc', 'price-desc', 'rating', 'newest']).optional(),
});

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99'),
});

export const updateCartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(0).max(99, 'Quantity cannot exceed 99'),
});

// Order schemas
export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
});

export const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Please enter a valid card number'),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Please enter a valid expiry date (MM/YY)'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Please enter a valid CVV'),
  nameOnCard: z.string().min(2, 'Name on card must be at least 2 characters'),
});

export const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  payment: paymentSchema,
  billingSameAsShipping: z.boolean(),
  billingAddress: shippingAddressSchema.optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
});

// Type exports
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ProductFilters = z.infer<typeof productFilterSchema>;
export type AddToCartForm = z.infer<typeof addToCartSchema>;
export type UpdateCartItemForm = z.infer<typeof updateCartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentInfo = z.infer<typeof paymentSchema>;
export type CheckoutForm = z.infer<typeof checkoutSchema>;
export type ContactForm = z.infer<typeof contactSchema>;
export type SearchForm = z.infer<typeof searchSchema>;
