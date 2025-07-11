import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://casungo.top",
  prefetch: true,
  experimental: {
    liveContentCollections: true,
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "it"],
  },
  integrations: [
    icon({
      include: {
        "material-symbols": [
          "translate-rounded",
          "sunny-rounded",
          "arrow-back",
          "dark-mode-rounded",
          "light-mode-rounded",
          "send-rounded",
          "mail-outline-rounded",
          "image-outline-rounded",
          "ar-on-you-outline-rounded",
          "stadia-controller-outline",
          "edit-document-outline-rounded",
        ],
        bxl: ["instagram", "github", "play-store", "google"],
      },
    }),
    sitemap(),
    svelte(),
  ],
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
  }),
  vite: {
    ssr: {
      external: ["buffer", "path", "fs", "os", "crypto", "async_hooks"].map((i) => `node:${i}`),
    },
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      SPOTIFY_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      SPOTIFY_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      SPOTIFY_REFRESH_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
  },
});
