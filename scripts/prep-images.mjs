#!/usr/bin/env node
import { readdir, mkdir } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import sharp from "sharp";

const INPUT_DIR = "raw-assets";
const OUTPUT_DIR = "public/images";
const WIDTHS = [400, 800, 1600];
const WEBP_QUALITY = 82;
const JPEG_QUALITY = 85;
const AVIF_QUALITY = 70;

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  let files;
  try {
    files = await readdir(INPUT_DIR);
  } catch {
    console.error(
      `Input dir ${INPUT_DIR}/ not found. Create it and place client images there.`,
    );
    process.exit(1);
  }

  const imageFiles = files.filter((f) => /\.(jpe?g|png|heic)$/i.test(f));
  if (imageFiles.length === 0) {
    console.log(
      `No images in ${INPUT_DIR}/ (looked for .jpg/.jpeg/.png/.heic).`,
    );
    return;
  }

  console.log(`Processing ${imageFiles.length} image(s) → ${OUTPUT_DIR}/\n`);

  for (const file of imageFiles) {
    const inputPath = join(INPUT_DIR, file);
    const base = basename(file, extname(file));
    const pipeline = sharp(inputPath).rotate();

    for (const width of WIDTHS) {
      const resized = pipeline
        .clone()
        .resize({ width, withoutEnlargement: true });

      try {
        await Promise.all([
          resized
            .clone()
            .webp({ quality: WEBP_QUALITY })
            .toFile(join(OUTPUT_DIR, `${base}-${width}.webp`)),
          resized
            .clone()
            .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
            .toFile(join(OUTPUT_DIR, `${base}-${width}.jpg`)),
        ]);
        if (width === 1600) {
          await resized
            .clone()
            .avif({ quality: AVIF_QUALITY })
            .toFile(join(OUTPUT_DIR, `${base}-${width}.avif`));
        }
      } catch (err) {
        if (/heif|heic/i.test(String(err?.message))) {
          console.error(
            `  ✗ ${file}: HEIC/HEIF decoding unsupported on this sharp build. Convert to JPG/PNG first.`,
          );
          break;
        }
        throw err;
      }
      console.log(
        `  ✓ ${base}-${width} (webp, jpg${width === 1600 ? ", avif" : ""})`,
      );
    }
  }

  console.log(
    `\nDone. Commit public/images/ and reference variants from components.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
