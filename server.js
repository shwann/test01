const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function assertIncludes(source, expected, label) {
  if (!source.includes(expected)) {
    throw new Error(`${label} is missing: ${expected}`);
  }
}

function checkHomepage() {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

  [
    ["<header class=\"site-header\">", "site header"],
    ["<section class=\"hero\">", "hero section"],
    ["id=\"about\"", "company profile section"],
    ["id=\"services\"", "products and services section"],
    ["id=\"news\"", "news section"],
    ["id=\"contact\"", "contact footer"],
    ["数珩科技", "company brand text"],
    ["数据智能", "company positioning text"],
    ["contact@shuheng.example", "company contact email"],
    ["产品服务", "service heading"],
    ["新闻动态", "news heading"],
    ["联系我们", "contact heading"],
  ].forEach(([needle, label]) => assertIncludes(html, needle, label));

  [
    ".site-header",
    ".hero",
    ".service-grid",
    ".news-list",
    "@media (max-width: 720px)",
  ].forEach((needle) => assertIncludes(css, needle, "responsive stylesheet"));

  console.log("Homepage structure check passed.");
}

function resolveFile(requestUrl) {
  const parsedUrl = new URL(requestUrl, `http://localhost:${port}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    return null;
  }

  return filePath;
}

if (process.argv.includes("--check")) {
  checkHomepage();
  process.exit(0);
}

const server = http.createServer((req, res) => {
  const filePath = resolveFile(req.url || "/");

  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });
    res.end(content);
  });
});

server.on("error", (error) => {
  console.error(`Unable to start local server on http://${host}:${port}`);
  console.error(error.message);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Company portal is running at http://${host}:${port}`);
});
