import { z, defineCollection } from "astro:content";

const projects = defineCollection({
    type: 'content',
		schema: ({ image }) => z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      credit: z.string(),
			heroImage: image(),
			images: z.array(image()),
    })
});

export const collections = {
  projects: projects,
};