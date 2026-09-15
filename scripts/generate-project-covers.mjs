import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const outputDir = resolve("src/images/generated");
const sources = {
  bereal: ["src/images/bereal.png", "copy"],
  excel2md: ["src/images/excel2md.png", "copy"],
  p7mreader: ["src/images/p7mreader.svg", "svg"],
  "markdown-docx": ["src/images/markdown-docx.svg", "svg"],
  "relation-sync": ["src/images/relation-sync.png", "copy"],
  msgemlviewer: ["src/images/msgemlviewer.svg", "svg"],
  splitmedia: ["src/images/splitmedia.png", "copy"],
  sedbot: ["src/images/sedbot.svg", "svg"],
};

await mkdir(outputDir, { recursive: true });

await Promise.all(
  Object.entries(sources).map(async ([name, [source, type]]) => {
    const destination = resolve(outputDir, `${name}.png`);
    if (type === "copy") {
      await copyFile(resolve(source), destination);
      return;
    }

    const svg = await readFile(resolve(source), "utf8");
    await writeFile(destination, new Resvg(svg).render().asPng());
  }),
);

console.log(`Generated ${Object.keys(sources).length} project covers from source artwork`);
