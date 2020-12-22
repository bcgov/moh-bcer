const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const serveStatic = express.static(`${__dirname}/build`);

const serveGzipped = (contentType) => (req, res, next) => {
  const acceptedEncodings = req.acceptsEncodings();
  if (acceptedEncodings.indexOf('gzip') === -1 || !fs.existsSync(`./build/${req.url}.gz`)) {
    next();
    return;
  }

  // update request's url
  req.url = `${req.url}.gz`;

  // set correct headers
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', contentType);

  // let express.static take care of the updated request
  next();
};

app.get('*.js', serveGzipped('text/javascript'));

app.get('*.css', serveGzipped('text/css'));

app.get('/robots.txt', (req, res) => {
  res.status(200).sendFile('robots.txt', {
    root: path.join(__dirname, '/build/public'),
    headers: {'Content-Type': 'text/plain;charset=UTF-8'},
  });
});

app.get('/service-worker.js', (req, res) => {
  res.set({ 'Content-Type': 'application/javascript; charset=utf-8' });
  res.send(fs.readFileSync('build/service-worker.js'));
});

app.use(serveStatic);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(port, () => console.log('Server running'));
