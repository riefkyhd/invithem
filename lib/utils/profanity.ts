const BLOCKED_KEYWORDS = [
  "anjing",
  "bangsat",
  "kontol",
  "memek",
  "tolol",
  "goblok",
  "bajingan",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "spam",
  "viagra",
  "casino",
  "porn",
  "xxx",
  "http://",
  "https://",
  "www.",
];

export function containsProfanity(text: string): boolean {
  const normalized = text.toLowerCase();
  return BLOCKED_KEYWORDS.some((word) => normalized.includes(word));
}
