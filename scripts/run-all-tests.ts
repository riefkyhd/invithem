#!/usr/bin/env npx tsx
/**
 * Full automated test runner: unit tests (Vitest) + optional Supabase integration suites.
 *
 * Usage: npm run test:all
 */

import { spawnSync } from "child_process";
import { loadEnvLocal, hasSupabaseEnv } from "../tests/helpers/load-env";

loadEnvLocal();

type SuiteResult = {
  name: string;
  status: "pass" | "fail" | "skip";
  detail?: string;
};

const results: SuiteResult[] = [];

function runCommand(name: string, command: string, args: string[]): boolean {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`SUITE: ${name}`);
  console.log("=".repeat(60));

  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });

  const passed = result.status === 0;
  results.push({
    name,
    status: passed ? "pass" : "fail",
    detail: passed ? undefined : `exit code ${result.status ?? "unknown"}`,
  });
  return passed;
}

function skipSuite(name: string, reason: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`SUITE: ${name} — SKIPPED`);
  console.log(reason);
  results.push({ name, status: "skip", detail: reason });
}

let allPassed = true;

if (!runCommand("Unit tests (Vitest)", "npx", ["vitest", "run"])) {
  allPassed = false;
}

if (hasSupabaseEnv()) {
  if (!runCommand("RLS regression", "npx", ["tsx", "scripts/rls-regression.ts"])) {
    allPassed = false;
  }
  if (!runCommand("Viding E2E parity", "npx", ["tsx", "scripts/viding-e2e.ts"])) {
    allPassed = false;
  }
  if (!runCommand("Browser E2E (Playwright)", "npx", ["playwright", "test"])) {
    allPassed = false;
  }
} else {
  skipSuite(
    "Supabase integration (RLS + Viding E2E + Playwright)",
    "Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY"
  );
}

console.log(`\n${"=".repeat(60)}`);
console.log("TEST SUMMARY");
console.log("=".repeat(60));

for (const r of results) {
  const icon = r.status === "pass" ? "PASS" : r.status === "skip" ? "SKIP" : "FAIL";
  console.log(`[${icon}] ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}

const passed = results.filter((r) => r.status === "pass").length;
const failed = results.filter((r) => r.status === "fail").length;
const skipped = results.filter((r) => r.status === "skip").length;

console.log(`\nTotal: ${results.length} suites | ${passed} passed | ${failed} failed | ${skipped} skipped`);

if (!allPassed) {
  process.exit(1);
}

console.log("\nAll automated test suites passed.");
