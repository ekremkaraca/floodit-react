import { compile } from "@tailwindcss/node";
import { Scanner, type SourceEntry } from "@tailwindcss/oxide";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const INPUT_CSS = resolve("src/index.css");
const OUTPUT_CSS = resolve("public/styles.css");
const POLL_MS = 700;

const FALLBACK_SOURCES: SourceEntry[] = [
  { base: process.cwd(), pattern: "./src/**/*.{ts,tsx,html}", negated: false },
  { base: process.cwd(), pattern: "./index.html", negated: false },
];

const WATCH_PATTERNS = [
  "index.html",
  "src/**/*.ts",
  "src/**/*.tsx",
  "src/**/*.css",
  "src/**/*.html",
];

async function scanWatchFiles() {
  const files = new Set<string>();

  for (const pattern of WATCH_PATTERNS) {
    const glob = new Bun.Glob(pattern);
    for await (const file of glob.scan(".")) {
      files.add(resolve(file));
    }
  }

  return [...files].sort();
}

async function getSnapshot() {
  const files = await scanWatchFiles();
  const stats = await Promise.all(
    files.map(async (file) => {
      try {
        const s = await stat(file);
        return `${file}:${s.mtimeMs}:${s.size}`;
      } catch {
        return `${file}:missing`;
      }
    }),
  );

  return stats.join("|");
}

async function buildTailwind() {
  const input = await readFile(INPUT_CSS, "utf8");
  const compiled = await compile(input, {
    base: process.cwd(),
    from: INPUT_CSS,
    onDependency() {},
  });

  const sources = compiled.sources.length > 0 ? compiled.sources : FALLBACK_SOURCES;
  const scanner = new Scanner({ sources });
  const candidates = scanner.scan();
  const css = compiled.build(candidates);

  await mkdir(dirname(OUTPUT_CSS), { recursive: true });
  await writeFile(OUTPUT_CSS, css);

  console.log(`[tailwind] built public/styles.css (${candidates.length} candidates)`);
}

async function watch() {
  let snapshot = await getSnapshot();
  console.log(`[tailwind] watching for changes...`);

  setInterval(async () => {
    try {
      const next = await getSnapshot();
      if (next === snapshot) return;
      snapshot = next;
      await buildTailwind();
    } catch (error) {
      console.error("[tailwind] watch error:", error);
    }
  }, POLL_MS);
}

const isWatch = process.argv.includes("--watch");

try {
  await buildTailwind();
  if (isWatch) {
    await watch();
  }
} catch (error) {
  console.error("[tailwind] build failed:", error);
  process.exit(1);
}
