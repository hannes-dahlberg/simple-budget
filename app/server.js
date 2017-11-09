const express = require('express')
const manifest = require('express-manifest')
const bodyParser = require('body-parser')
const history = require('connect-history-api-fallback')
const path = require('path');

const app = express();

app.use(manifest({
  manifest: __dirname + '/../dist/mix-manifest.json',
  prepend: __dirname + '/../dist',
  reqPathFind: /^(\/?)/,
  reqPathReplace: ''
}));

let controller = require('./controllers/controller')
let middleware = require('./middleware')

app.use(express.static(__dirname + '/../dist'))
app.use(bodyParser.json({ limit: '50mb' }))

app.post('/api/backup', middleware.key, controller.api.backup)
app.get('/api/restore', middleware.key, controller.api.restore)

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
})