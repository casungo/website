import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  site: "https://casungo.top",
  prefetch: true,
  integrations: [sitemap(), svelte(), db()],
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
  experimental: {
    env: {
      schema: {
        LASTFM_API_KEY: envField.string({
          context: "server",
          access: "secret",
          optional: false,
        }),
      },
    },
  },
});
