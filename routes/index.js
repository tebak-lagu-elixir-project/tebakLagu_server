const router = require('express').Router()
const songsRouter = require('./songs.js')

router.use('/songs', songsRouter)

module.exports = router