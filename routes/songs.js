const router = require('express').Router()
const SongController = require('../controllers/SongController.js')

router.get('/:category', SongController.getByCategory)
router.get('/custom/:keyword', SongController.getByKeyword)
router.post('/answer/:idPlaylist', SongController.checkAnswer)

module.exports = router