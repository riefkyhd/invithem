import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";

/** Minimal valid MP3 frame for upload E2E (tiny silent clip). */
const MINIMAL_MP3_BASE64 =
  "//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export const TEST_AUDIO_PATH = join(__dirname, "test-audio.mp3");

export function ensureTestAudioFixture() {
  mkdirSync(dirname(TEST_AUDIO_PATH), { recursive: true });
  writeFileSync(TEST_AUDIO_PATH, Buffer.from(MINIMAL_MP3_BASE64, "base64"));
}
