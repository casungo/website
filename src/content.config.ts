import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/**.md", base: "./src/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      credit: z.string(),
      colorCorrection: z.string().optional(),
      editing: z.string().optional(),
      heroImage: image(),
      images: z.array(image()),
    }),
});

export const collections = {
  projects: projects,
};
