import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://casungo.top",
  prefetch: true,
  integrations: [sitemap()],
  output: "hybrid",
  adapter: cloudflare({
    imageService: "compile",
  }),
  i18n: {
    defaultLocale: "it",
    locales: ["en", "it"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
