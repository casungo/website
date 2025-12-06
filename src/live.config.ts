import { defineLiveCollection } from "astro:content";
import { spotifyLoader } from "./loaders/spotify";

const spotify = defineLiveCollection({
  type: "live",
  loader: spotifyLoader() as any,
});

export const collections = { spotify };
