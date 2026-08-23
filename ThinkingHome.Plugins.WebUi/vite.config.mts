import { resolve } from "node:path";
import { cpSync, mkdirSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import { cssInject, precompress, SHARED_EXTERNALS } from "@thinking-home/ui/build";

// The WebUi host client is built as an ESM bundle (Resources/app/main.js),
// loaded via <script type="module">. The shared libraries (react, react-router,
// @thinking-home/ui, …) are left as bare imports for the browser's import map to
// resolve to the vendor modules — they are not bundled, so the host shares the
// one React instance with every plugin. CSS is inlined into main.js by cssInject.
const root = process.cwd();
const outDir = resolve(root, "Resources/app");

// Copy th-ui's prebuilt vendor ESM modules (+ shared.json manifest) into the
// host's resources, so they get embedded in the DLL and served under the import
// map. Replaces the old single vendor.js copy.
function copyVendor(): Plugin {
  return {
    name: "th-copy-vendor",
    apply: "build",
    closeBundle() {
      const src = resolve(root, "node_modules/@thinking-home/ui/vendor");
      const dst = resolve(outDir, "vendor");
      mkdirSync(dst, { recursive: true });
      cpSync(src, dst, { recursive: true });
    },
  };
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    // Зависимости, попадающие в бандл, могут проверять process.env.NODE_ENV —
    // в браузере такого объекта нет, поэтому значение подставляется при сборке.
    // th-build делает то же самое для бандлов плагинов.
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    esbuild: {
      jsx: "transform",
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
    },
    // precompress сжимает только то, что выдала сборка (main.js): у вендорных
    // модулей свои предсжатые копии и свой манифест, их копирует copyVendor
    plugins: [cssInject(), precompress(), copyVendor()],
    build: {
      target: "es2020",
      outDir,
      emptyOutDir: true,
      minify: isProduction ? "oxc" : false,
      sourcemap: isProduction ? false : "inline",
      lib: {
        entry: "frontend/index.tsx",
        formats: ["es"],
        fileName: () => "main.js",
      },
      rollupOptions: {
        external: SHARED_EXTERNALS,
        output: { codeSplitting: false },
      },
    },
  };
});
