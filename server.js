const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const WORKSPACE_ROOT = path.join(__dirname, '..', '..');
const FRONTEND_USER_DIR = path.join(WORKSPACE_ROOT, 'FRONTEND', 'USER');
const FRONTEND_ADMIN_DIR = path.join(WORKSPACE_ROOT, 'FRONTEND', 'ADMIN');
const linksPath = path.join(__dirname, 'data-important-links.json');
const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
const linksBySlug = Object.fromEntries(links.map((item) => [item.slug, item]));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload, null, 2));
}

function sendRedirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream'
    });
    res.end(data);
  });
}

function sanitizePathname(pathname) {
  const decoded = decodeURIComponent(pathname);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  return normalized === '/' ? '/index.html' : normalized;
}

function resolveFrontendPath(pathname) {
  if (pathname === '/' || pathname === '/index.html') {
    return path.join(FRONTEND_USER_DIR, 'index.html');
  }

  if (pathname === '/admin.html') {
    return path.join(FRONTEND_ADMIN_DIR, 'admin.html');
  }

  if (pathname === '/service-hub.html' || pathname === '/service-hub') {
    return path.join(FRONTEND_USER_DIR, 'service-hub.html');
  }

  const normalized = pathname.replace(/^\/+/, '');
  const userCandidate = path.join(FRONTEND_USER_DIR, normalized);
  const adminCandidate = path.join(FRONTEND_ADMIN_DIR, normalized);

  if (fs.existsSync(userCandidate) && fs.statSync(userCandidate).isFile()) {
    return userCandidate;
  }

  if (fs.existsSync(adminCandidate) && fs.statSync(adminCandidate).isFile()) {
    return adminCandidate;
  }

  return null;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = requestUrl;

  if (pathname === '/api/important-links') {
    return sendJson(res, 200, links);
  }

  if (pathname.startsWith('/api/important-links/')) {
    const slug = pathname.split('/').pop();
    const link = linksBySlug[slug];

    if (!link) {
      return sendJson(res, 404, { error: 'Service not found' });
    }

    return sendJson(res, 200, link);
  }

  if (pathname.startsWith('/go/')) {
    const slug = pathname.split('/').pop();
    const link = linksBySlug[slug];

    if (!link) {
      return sendRedirect(res, '/service-hub.html?missing=1');
    }

    if (link.status === 'active' && link.officialUrl) {
      return sendRedirect(res, link.officialUrl);
    }

    return sendRedirect(res, `/service-hub.html?slug=${encodeURIComponent(slug)}`);
  }

  if (pathname === '/service-hub' || pathname === '/service-hub.html') {
    const serviceHubPath = resolveFrontendPath('/service-hub.html');
    return serveFile(res, serviceHubPath);
  }

  const resolvedPath = resolveFrontendPath(pathname);
  if (!resolvedPath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err) {
      const slug = searchParams.get('slug');
      if (slug && pathname.endsWith('.html')) {
        return serveFile(res, path.join(FRONTEND_USER_DIR, 'service-hub.html'));
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    if (stats.isDirectory()) {
      return serveFile(res, path.join(resolvedPath, 'index.html'));
    }

    serveFile(res, resolvedPath);
  });
});

server.listen(PORT, () => {
  console.log(`AMT website server running at http://localhost:${PORT}`);
});
