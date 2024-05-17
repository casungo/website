import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import db from "@astrojs/db";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://casungo.top",
  prefetch: true,
  integrations: [sitemap(), svelte(), db(), icon()],
  output: "hybrid",
  adapter: cloudflare({
    imageService: "compile",
  }),
  vite: {
    ssr: {
      external: ["node:buffer", "node:path", "node:fs", "node:os"],
    },
  },
  i18n: {
    defaultLocale: "it",
    locales: ["en", "it"],
  },
});
