import { defineConfig } from "astro/config";
import pageInsight from "astro-page-insight";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://casungo.top",
  prefetch: true,
  integrations: [pageInsight(), sitemap()]
});