import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/**.md", base: "./src/projects" }),
  schema: () =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      credit: z.string(),
      colorCorrection: z.string().optional(),
      editing: z.string().optional(),
      heroImage: z.string(),
      images: z.array(z.string()),
    }),
});

export const collections = {
  projects: projects,
};
