require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Basic Configuration
const port = process.env.PORT || 3000;

let id = 1;
let urls = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/getall', (req, res) => {
  res.json(urls);
})

app.post('/api/shorturl', (req, res) => {
  let { url: original_url } = req.body; // Cambia 'url' a 'original_url'

  // Validar la URL
  const httpRegex = /^(http|https)(:\/\/)/;
  if (!httpRegex.test(original_url)) {
    return res.json({ error: 'invalid url' });
  }

  const exists = urls.find(u => u.original_url === original_url);
  if (exists) {
    res.json({ original_url: exists.original_url, short_url: exists.short_url });
    return;
  }

  let short_url = id++;
  urls.push({ original_url, short_url });

  res.json({ original_url, short_url });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  let short_url = Number(req.params.short_url);
  let url = urls.find(u => u.short_url === short_url);

  if (url) {
    res.redirect(url.original_url);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});



app.listen(port, function () {
  console.log(`Listening on port http://localhost:${port}`);
});
