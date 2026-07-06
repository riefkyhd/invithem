import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";

/** 1×1 PNG for gallery upload E2E */
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export const TEST_IMAGE_PATH = join(__dirname, "test-image.png");

export function ensureTestImageFixture() {
  mkdirSync(dirname(TEST_IMAGE_PATH), { recursive: true });
  writeFileSync(TEST_IMAGE_PATH, Buffer.from(PNG_BASE64, "base64"));
}
