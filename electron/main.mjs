import { app, BrowserWindow, dialog } from 'electron';
import { spawn } from 'node:child_process';
import { createServer, request as httpRequest } from 'node:http';
import { existsSync, statSync, createReadStream } from 'node:fs';
import path from 'node:path';

const WEB_PORT = Number(process.env.DESKTOP_PORT ?? 4173);
const BFF_PORT = Number(process.env.DESKTOP_BFF_PORT ?? 8788);
const BFF_HOST = '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

let bffProcess = null;
let webServer = null;

const sandboxHelperMissing = () => {
  try {
    const helper = path.join(path.dirname(process.execPath), 'chrome-sandbox');
    if (!existsSync(helper)) return true;
    return (statSync(helper).mode & 0o4000) === 0;
  } catch {
    return true;
  }
};

const containerFlags = [
  '--no-sandbox',
  '--disable-gpu',
  '--in-process-gpu',
  '--disable-dev-shm-usage',
];
const needsContainerFlags =
  process.env.AIT_ELECTRON_NO_SANDBOX === '1' || sandboxHelperMissing();

if (needsContainerFlags && containerFlags.some((flag) => !process.argv.includes(flag))) {
  const relaunch = spawn(process.execPath, [...containerFlags, ...process.argv.slice(1)], {
    detached: true,
    stdio: 'inherit',
  });
  relaunch.unref();
  process.exit(0);
}

const appRoot = () => app.getAppPath();

const waitForPort = (port, timeoutMs) =>
  new Promise((resolve, reject) => {
    const started = Date.now();
    const attempt = () => {
      const socket = httpRequest(
        { hostname: BFF_HOST, port, path: '/', method: 'GET', timeout: 500 },
        (response) => {
          response.resume();
          resolve();
        },
      );
      socket.on('error', () => {
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timed out waiting for 127.0.0.1:${port}`));
          return;
        }
        setTimeout(attempt, 150);
      });
      socket.on('timeout', () => socket.destroy());
      socket.end();
    };
    attempt();
  });

const startBff = () => {
  const serverEntry = path.join(appRoot(), 'server', 'index.mjs');
  if (!existsSync(serverEntry)) {
    throw new Error(`BFF entry not found at ${serverEntry}`);
  }

  bffProcess = spawn(process.execPath, [serverEntry], {
    cwd: appRoot(),
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      BFF_PORT: String(BFF_PORT),
      BFF_HOST,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  bffProcess.stdout.on('data', (chunk) => {
    process.stdout.write(`[bff] ${chunk}`);
  });
  bffProcess.stderr.on('data', (chunk) => {
    process.stderr.write(`[bff] ${chunk}`);
  });
  bffProcess.on('exit', (code, signal) => {
    if (code && code !== 0) {
      console.error(`BFF exited with code ${code} signal ${signal ?? ''}`);
    }
    bffProcess = null;
  });
};

const sendFile = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
  createReadStream(filePath).pipe(res);
};

const startWeb = (distDir) =>
  new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      if (!req.url || !req.method) {
        res.writeHead(400);
        res.end();
        return;
      }

      if (req.url.startsWith('/api/')) {
        const upstream = httpRequest(
          {
            hostname: BFF_HOST,
            port: BFF_PORT,
            path: req.url,
            method: req.method,
            headers: { ...req.headers, host: `${BFF_HOST}:${BFF_PORT}` },
          },
          (upstreamRes) => {
            res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
            upstreamRes.pipe(res);
          },
        );
        upstream.on('error', () => {
          if (!res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
          }
          res.end(JSON.stringify({ error: 'Desktop API server is unavailable.' }));
        });
        req.pipe(upstream);
        return;
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405);
        res.end();
        return;
      }

      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
      const candidate = path.resolve(distDir, relative);
      const insideDist = candidate === distDir || candidate.startsWith(`${distDir}${path.sep}`);
      const filePath =
        insideDist && existsSync(candidate) && statSync(candidate).isFile()
          ? candidate
          : path.join(distDir, 'index.html');

      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end('Desktop build is missing. Run npm run build:desktop.');
        return;
      }

      if (req.method === 'HEAD') {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
        res.end();
        return;
      }

      sendFile(res, filePath);
    });

    server.on('error', reject);
    server.listen(WEB_PORT, BFF_HOST, () => {
      webServer = server;
      resolve();
    });
  });

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 390,
    minHeight: 640,
    backgroundColor: '#040504',
    autoHideMenuBar: true,
    title: 'AIT PROfessor',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  win.loadURL(`http://${BFF_HOST}:${WEB_PORT}/`);
};

const stopChildren = () => {
  if (bffProcess && !bffProcess.killed) {
    bffProcess.kill('SIGTERM');
  }
  if (webServer) {
    webServer.close();
    webServer = null;
  }
};

app.whenReady().then(async () => {
  try {
    const distDir = path.join(appRoot(), 'dist');
    if (!existsSync(path.join(distDir, 'index.html'))) {
      throw new Error(`Built UI not found at ${distDir}. Run npm run build:desktop.`);
    }
    startBff();
    await waitForPort(BFF_PORT, 15000);
    await startWeb(distDir);
    createWindow();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Desktop startup failed.';
    dialog.showErrorBox('AIT PROfessor', message);
    stopChildren();
    app.quit();
  }
});

app.on('window-all-closed', () => {
  stopChildren();
  app.quit();
});

app.on('before-quit', () => {
  stopChildren();
});
