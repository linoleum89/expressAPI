const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/webpack.config.js');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;
const app = express();

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "'GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.get('/', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '/../dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/../dist')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

app.listen(port, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  // eslint-disable-next-line no-console
  console.info(`Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
});
app.use('/', routes);