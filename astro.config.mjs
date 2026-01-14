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
  image: {
    domains: ["cdn.casungo.top"],
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
          "table-chart-outline",
          "call-split",
          "open-in-new-rounded",
        ],
        bxl: ["instagram", "github", "play-store", "google"],
      },
    }),
    sitemap(),
    svelte(),
  ],
  output: "server",
  adapter: cloudflare({
    imageService: "cloudflare",
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
        optional: true,
      }),
      SPOTIFY_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      SPOTIFY_REFRESH_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      CLOUDFLARE_ACCOUNT_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      CLOUDFLARE_API_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
});
