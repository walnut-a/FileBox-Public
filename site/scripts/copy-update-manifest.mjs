import { copyFile, mkdir } from "node:fs/promises";

const source = new URL("../src/data/stable-release.json", import.meta.url);
const outputDirectory = new URL("../dist/updates/", import.meta.url);
const output = new URL("stable.json", outputDirectory);

await mkdir(outputDirectory, { recursive: true });
await copyFile(source, output);
