import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import zaloMiniApp from "zmp-vite-plugin";
import fs from "fs";

// Helper function to copy directory recursively
function copyDirRecursive(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const files = fs.readdirSync(src);
  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "",
  build: {
    outDir: "www",
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    zaloMiniApp(),
    react(),
    mode === "development" && componentTagger(),
    {
      name: "copy-to-dist",
      writeBundle() {
        // Copy www to dist after build
        if (fs.existsSync("www")) {
          if (fs.existsSync("dist")) {
            fs.rmSync("dist", { recursive: true, force: true });
          }
          copyDirRecursive("www", "dist");
          console.log("✓ Copied www/ to dist/");
        }
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
