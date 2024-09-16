import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import db from "@astrojs/db";
import i18n from "@astrolicious/i18n";
import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
  site: "https://casungo.top",
  prefetch: true,
  integrations: [
    icon({
      include: {
        "material-symbols": ["translate-rounded", "sunny-rounded", "arrow-back", "dark-mode-rounded", "light-mode-rounded"],
      },
    }),
    i18n({
      defaultLocale: "en",
      locales: ["en", "it"],
      client: {
        data: true,
        paths: true,
        translations: true,
      },
    }),
    sitemap(),
    svelte(),
    db(),
    tailwind(),
    auth(),
  ],
  output: "hybrid",
  adapter: cloudflare({
    imageService: "compile",
  }),
  vite: {
    ssr: {
      external: ["buffer", "path", "fs", "os", "crypto", "async_hooks"].map((i) => `node:${i}`),
    },
  },
  experimental: {
    env: {
      schema: {
        LASTFM_API_KEY: envField.string({
          context: "server",
          access: "secret",
          optional: false,
        }),
        GOOGLE_CLIENT_ID: envField.string({
          context: "server",
          access: "secret",
          optional: false,
        }),
        GOOGLE_CLIENT_SECRET: envField.string({
          context: "server",
          access: "secret",
          optional: false,
        }),
        AUTH_TRUST_HOST: envField.string({
          context: "server",
          access: "secret",
          optional: false,
        }),
        AUTH_SECRET: envField.string({
          context: "server",
          access: "secret",
          optional: false,
        }),
      },
    },
  },
});
