import { z } from "zod";

export const blogPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(200, "Slug cannot exceed 200 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z
    .string()
    .trim()
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt cannot exceed 500 characters"),
  body: z
    .string()
    .trim()
    .min(20, "Body must be at least 20 characters"),
  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters")
    .max(100, "Category cannot exceed 100 characters"),
  published: z.boolean().default(true),
  imageRef: z.string().optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
