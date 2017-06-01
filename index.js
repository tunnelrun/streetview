#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const querystring = require('querystring');
const urlParse = require('url').parse;
const { exec } = require('child_process');

const nunjucks = require('nunjucks');
const static = require('node-static');

const rootDir = path.join(__dirname, 'public');
const cacheDir = path.join(rootDir, '.cache');
const host = process.env.TUNNELRUN_STREETVIEW_HOST || process.env.HOST || '0.0.0.0';
const port = process.env.TUNNELRUN_STREETVIEW_PORT || process.env.PORT || 7000;
const nodeEnv = process.env.NODE_ENV || 'development';

const baseUrl = nodeEnv === 'production' ? 'https://streetview.tunnel.run' : `http://${host}:${port}`;

try {
  fs.mkdirSync(cacheDir);
} catch (e) {
}

const nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader('templates'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Range'
};

const staticServer = new static.Server(rootDir, {
  headers: corsHeaders
});

const server = http.createServer((req, res) => {
  // Example URL formats:
  // - /#27.814125,86.713193
  // - /?27.814125,86.713193
  // - /#27.814125 86.713193
  // - /27.814125/86.713193
  let parsedUrl = req.url.substr(req.url.indexOf('?') + 1);
  let matches = parsedUrl.match(/(-?[\d\.]+)\s*[,\/ ]\s*(-?[\d\.]+)/);
  let geoLat;
  let geoLong;
  let geoLatLong;
  let geo;

  if (matches) {
    geoLat = parseFloat(matches[1]);
    geoLong = parseFloat(matches[2]);
    geoLatLong = `${geoLat},${geoLong}`;
  }

  const reqUrl = urlParse(req.url);
  const reqPathname = reqUrl.pathname;
  const reqQuery = querystring.parse((reqUrl.search || '').substr(1));

  if (reqPathname.endsWith('vr.html')) {
    const pageUrl = req.url.replace('/vr.html', '');

    let templateCtx = {
      page: {
        name: reqQuery.name || '360° Street-View Panorama',
        description: reqQuery.description || '360° Street-View Panorama',
        url: baseUrl + pageUrl,
        pano: {
          src: baseUrl + pageUrl + '.jpg'
        }
      }
    };

    nunjucksEnv.render('vr.njk', templateCtx, (err, nunjucksRes) => {
      if (err) {
        return console.log(err);
      }

      Object.keys(corsHeaders).forEach(key => {
        res.setHeader(key, corsHeaders[key]);
      });

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(nunjucksRes.toString());
      res.end();
    });
    return;
  }

  if (!geoLatLong) {
    staticServer.serve(req, res);
    return;
  }

  const hash = crypto.createHash('sha1').update(geoLatLong).digest('hex');
  const hashPath = `streetview_${hash}.jpg`;
  const hashUrl = '/.cache/' + hashPath;
  const fn = path.join(cacheDir, hashPath);

  fs.stat(fn, function (err, stats) {
    if (!err && stats.isFile()) {
      req.url = hashUrl;
      // Read from file.
      staticServer.serve(req, res);
      return;
    }

    exec(`extract-streetview ${geoLatLong} --zoom 4 --o ${fn}`, {cwd: __dirname}, (err, stdout, stderr) => {
      if (err) {
        console.error('Fatal error from `extract-streetview`:', err);
        return;
      }
      if (stdout && stdout.toString && stdout.toString().trim()) {
        console.log('Output from `extract-streetview`:', stdout);
      }
      if (stderr && stderr.toString && stderr.toString().trim()) {
        console.error('Error from `extract-streetview`:', stderr);
      }
      req.url = hashUrl;
      staticServer.serve(req, res);
    });
  });
}).listen(port, host, function () {
  console.log(`[${nodeEnv}] Listening on http://${host}:${port}`);
});
