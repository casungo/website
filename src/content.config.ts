import { z, defineCollection } from "astro:content";
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
      images: z.array(
        z.union([
          z.string(), // Allow simple string paths for backward compatibility
          z.object({
            src: z.string(),
            width: z.number(),
            height: z.number(),
          }),
        ]),
      ),
    }),
});

export const collections = {
  projects: projects,
};
