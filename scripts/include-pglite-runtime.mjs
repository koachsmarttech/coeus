#!/usr/bin/env node
/**
 * Nitro externalizes PGlite for the Vercel server build. Copy the dependency
 * into each generated function because Nitro's output currently leaves the
 * bare runtime import untraced in Vercel's function bundle.
 */
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const functionsDir = join(root, ".vercel", "output", "functions");
const packageDir = join(root, "node_modules", "@electric-sql", "pglite");

if (!existsSync(functionsDir) || !existsSync(packageDir)) {
  throw new Error("Expected the Vercel function output and installed PGlite package after vite build.");
}

const functions = readdirSync(functionsDir, { withFileTypes: true }).filter(
  (entry) => entry.isDirectory() && entry.name.endsWith(".func"),
);
if (functions.length === 0) throw new Error("No Vercel function output found to package PGlite into.");

for (const fn of functions) {
  const destination = join(functionsDir, fn.name, "node_modules", "@electric-sql", "pglite");
  mkdirSync(join(destination, ".."), { recursive: true });
  cpSync(packageDir, destination, { recursive: true, force: true });
  console.log(`[pglite] included runtime package in ${fn.name}`);
}
