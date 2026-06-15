// Minimal dependency-free web server for the Managed Cloud [targets.web] target.
// Honors $PORT (injected by the runner) and serves a page at /.
const http = require("http");
const port = Number(process.env.PORT) || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(
      `<!doctype html><meta charset="utf-8"><title>hello-capsule</title>` +
        `<h1>hello from Managed Cloud \u{1F44B}</h1>` +
        `<p>Served by <code>hello-capsule</code> <code>[targets.web]</code> on port ${port}.</p>`,
    );
  })
  .listen(port, "0.0.0.0", () =>
    console.log(`hello-capsule web listening on ${port}`),
  );
