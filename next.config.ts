import type { NextConfig } from "next";

// WARNING: Do NOT add `reactCompiler: true` without installing `react-compiler-runtime`.
// WARNING: Do NOT set `turbopack.root` to `process.cwd()` — it resolves to the wrong
// directory when a stray lockfile exists above the project (e.g. ~/package-lock.json),
// causing Turbopack to spawn cascading PostCSS processes that freeze the machine.
// Always use `import.meta.dirname` which reliably points to this config file's directory.
const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
