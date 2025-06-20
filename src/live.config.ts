import { defineLiveCollection } from "astro:content";
import { spotifyLoader } from "./loaders/spotify";

const spotify = defineLiveCollection({
  type: "live",
  loader: spotifyLoader(),
});

export const collections = { spotify };
