const express = require('express')
const app = express()
const ShortUrl = require('./models/shortUrl')
const mongoose = require('mongoose')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
mongoose.connect(process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', (err)=> console.error(err))
db.on('open', ()=> console.log('Connected to Mongodb'))


app.get('/', async (req, res)=>{
  const shortUrls = await ShortUrl.find()
  res.render('index', {shortUrls: shortUrls})
})


app.post('/shortUrls', async (req, res)=>{
  await ShortUrl.create({full: req.body.fullUrl})
  res.redirect('/')
})


app.get('/:shortUrl', async(req, res)=>{
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) res.status(404).send()
  
  ++shortUrl.clicks
  shortUrl.save()
  res.redirect(shortUrl.full)
})

app.listen(5000)