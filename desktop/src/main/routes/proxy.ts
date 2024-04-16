import type { Application, Request, Response } from 'express';
import { App } from 'electron/main';
import request from 'request';
import bodyParser from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function registerRoutes(app: Application, electronApp: App) {
  // app.get('/api/proxy/:url', bodyParser.json(), async function (req: Request, res: Response) {
  //   console.log(decodeURIComponent(req.params.url));
  //   request(decodeURIComponent(req.params.url)).pipe(res).on('error', console.error).on('close', console.log);
  // })

  app.use('/api/proxy', createProxyMiddleware({
    router: (req) => new URL(req.url.substring(1)),
    pathRewrite: (path, req) => (new URL(path.substring(1))).pathname,
    followRedirects: true,
    changeOrigin: true,
    on: {
      proxyRes: (proxyRes, req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
      }
    },
    logger: console
  }))
}
