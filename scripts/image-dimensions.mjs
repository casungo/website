import { readFile, readdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const galleryFiles = (await readdir("src/galleries")).filter((file) => file.endsWith(".md"));
const paths = (await Promise.all(galleryFiles.map(async (file) => [...(await readFile(`src/galleries/${file}`, "utf8")).matchAll(/^  - "(.+)"$/gm)].map((match) => match[1])))).flat();

const entries = [];
let next = 0;
await Promise.all(
  Array.from({ length: 12 }, async () => {
    while (next < paths.length) {
      const path = paths[next++];
      const response = await fetch(new URL(path, "https://cdn.casungo.top/"));
      if (!response.ok) throw new Error(`${response.status} ${path}`);
      const { width, height } = await sharp(await response.arrayBuffer()).metadata();
      if (!width || !height) throw new Error(`Missing dimensions: ${path}`);
      entries.push([path, { width, height }]);
    }
  }),
);

const dimensions = Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));

await writeFile("src/galleries/image-dimensions.json", `${JSON.stringify(dimensions, null, 2)}\n`);
console.log(`Saved dimensions for ${paths.length} images.`);
