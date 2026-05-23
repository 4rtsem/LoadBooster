const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const assets = ["index.html", "styles.css", "app.js", "img"];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

assets.forEach((asset) => {
  const source = path.join(root, asset);
  const target = path.join(dist, asset);
  fs.cpSync(source, target, { recursive: true });
});

console.log(`Built static site in ${dist}`);
