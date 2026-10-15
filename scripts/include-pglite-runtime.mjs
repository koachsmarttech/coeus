#!/usr/bin/env node
/**
 * PGlite's bundled server chunk loads its WASM binaries and filesystem archive
 * from its sibling _libs directory. Nitro includes the code bundle but Vercel's
 * function trace omits these dynamically loaded assets, so copy them beside it.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const functionsDir = join(root, ".vercel", "output", "functions");
const sourceDir = join(root, "node_modules", "@electric-sql", "pglite", "dist");
const assets = ["pglite.data", "pglite.wasm", "initdb.wasm"];

if (!existsSync(functionsDir) || assets.some((asset) => !existsSync(join(sourceDir, asset)))) {
  throw new Error("Expected the Vercel function output and PGlite runtime assets after vite build.");
}

const functions = readdirSync(functionsDir, { withFileTypes: true }).filter(
  (entry) => entry.isDirectory() && entry.name.endsWith(".func"),
);
if (functions.length === 0) throw new Error("No Vercel function output found to package PGlite into.");

for (const fn of functions) {
  const libsDir = join(functionsDir, fn.name, "_libs");
  mkdirSync(libsDir, { recursive: true });
  for (const asset of assets) copyFileSync(join(sourceDir, asset), join(libsDir, asset));
  console.log(`[pglite] included WASM runtime assets in ${fn.name}`);
}
