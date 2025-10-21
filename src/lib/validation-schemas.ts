import { z } from 'zod';

// SECURITY: Text content validation - prevents XSS and excessive data
export const textContentSchema = z.string()
  .trim()
  .min(1, "Content cannot be empty")
  .max(5000, "Content too long (max 5000 characters)")
  .refine(val => !/<script/i.test(val), "Script tags not allowed");

export const shortTextSchema = z.string()
  .trim()
  .min(1, "Content cannot be empty")
  .max(500, "Content too long (max 500 characters)")
  .refine(val => !/<script/i.test(val), "Script tags not allowed");

// SECURITY: URL validation - prevents javascript: protocol and invalid URLs
export const urlSchema = z.string()
  .trim()
  .url("Invalid URL format")
  .refine(val => /^https?:\/\//i.test(val), "Only HTTP/HTTPS URLs allowed");

// SECURITY: Email validation
export const emailSchema = z.string()
  .trim()
  .email("Invalid email format")
  .max(255, "Email too long");

// SECURITY: Number validation for charts - prevents negative or extreme values
export const chartNumberSchema = z.number()
  .int("Must be an integer")
  .min(0, "Cannot be negative")
  .max(10000, "Value too large (max 10000)");

// SECURITY: Chart data validation
export const githubDataSchema = z.object({
  month: z.string().trim().min(1).max(50),
  repos: chartNumberSchema
});

export const codingDataSchema = z.object({
  platform: z.string().trim().min(1).max(100),
  questions: chartNumberSchema
});

// SECURITY: Project validation
export const projectSchema = z.object({
  id: z.string(),
  name: shortTextSchema,
  tech: shortTextSchema,
  status: z.string().max(50),
  description: textContentSchema,
  link: urlSchema.or(z.literal('https://')).nullable(),
  github: urlSchema.or(z.literal('https://github.com/')).nullable()
});

// SECURITY: Contact info validation
export const contactInfoSchema = z.object({
  id: z.string(),
  icon: z.string(),
  label: shortTextSchema,
  value: shortTextSchema,
  link: urlSchema.nullable()
});

// SECURITY: Experience validation
export const experienceSchema = z.object({
  id: z.string(),
  role: shortTextSchema,
  org: shortTextSchema,
  period: z.string().max(100),
  achievements: z.array(textContentSchema)
});

// SECURITY: Skill validation
export const skillSchema = z.object({
  id: z.string(),
  name: shortTextSchema,
  level: z.number().min(0).max(100)
});

export const skillCategorySchema = z.object({
  id: z.string(),
  title: shortTextSchema,
  icon: z.string(),
  skills: z.array(skillSchema)
});
