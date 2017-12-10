const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/webpack.config.js');
//var router = express.Router();
//var models = require('../models/index');
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

// app.use(bodyParser.json());

// app.get('/api/load', (req, res) => {
//   res.sendFile(path.join(__dirname, 'items.json'));
// });

// router.post('/users', function (req, res) {
//   console.log(req.body)
//   // models.User.create({
//   //     first_name: req.body.first_name,
//   //     last_name: req.body.last_name,
//   //     city: req.body.city,
//   //     state: req.body.state,
//   // }).then(function (user) {
//   //     res.json(user);
//   // });
//   res.json(req.body);
// });


// app.route('/users')
// .get(function (req, res) {
//   res.json({algo: true});
// })
// .post(function(req, res) {
//   console.log(req.body);
//   //res.send('post');
//   res.status(200).send('listo');
// })
app.use('/', routes);