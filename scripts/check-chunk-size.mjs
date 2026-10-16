#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const htmlPath = resolve(process.cwd(), "dist/index.html");
const html = readFileSync(htmlPath, "utf8");
const match = html.match(/src="\/assets\/(index-[^"]+\.js)"/);

if (!match) {
  console.error("Unable to find main index chunk in dist/index.html");
  process.exit(1);
}

const mainChunkPath = resolve(process.cwd(), "dist/assets", match[1]);
const sizeBytes = readFileSync(mainChunkPath).byteLength;
const threshold = Number.parseInt(process.env.MAX_MAIN_CHUNK_BYTES ?? "450000", 10);

if (sizeBytes > threshold) {
  console.error(
    `Main chunk too large: ${sizeBytes} bytes > ${threshold} bytes. ` +
      "Use additional lazy loading or manual chunking.",
  );
  process.exit(1);
}

console.log(`Main chunk size check passed (${sizeBytes} <= ${threshold})`);
