// const { Playlist } = require('../models')
const axios = require('axios')

class SongController {
    static API_DEEZER = 'http://api.deezer.com'

    static randomSong(songs){
        let listSong = []
        while(listSong.length < 10){
            let random = Math.floor(Math.random()*songs.length)
            listSong.push(songs.splice(random,1)[0]) 
        }
        return listSong
    }

    static async checkAnswer(req, res){
        let { inputAnswer, username } = req.body
        axios.get(`${SongController.API_DEEZER}/track/${req.params.idPlaylist}`)
          .then(({ data }) => {
              let title = data.title.toLowerCase().split(' (')
              title[1] = title[1].slice(0,title[1].length - 1)
              if(title[0] == inputAnswer){
                  //proses jika jawaban benar
                  //update score dll
                res.status(200).json({
                    score: 10,
                    message: `${username} Berhasil menjawab !`
                })
              }else{
                  res.status(200).json({
                      score: 0,
                      message: 'Jawaban Salah !'
                  })
              }
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({
                message : 'Internal Server Error'
            })
        })
    }

    static async getByKeyword(req, res){
        axios.get(`${SongController.API_DEEZER}/search?limit=100&q=${req.params.keyword}`)
          .then(({ data }) => {
              let songs  = data.data.map(song => {
                  let formatSong = {
                      id: song.id,
                      preview: song.preview
                  }
                  return formatSong
              })
              songs = SongController.randomSong(songs)
              res.status(200).json({
                  songs
              })
          })
          .catch(err => {
              console.log(err)
              res.status(500).json({
                  message : 'Internal Server Error'
              })
          })
    }

    static async getByCategory (req, res){
        let keyword;
        switch (req.params.category){
            case 'chart':
                    keyword = 'chart/0/tracks'
                    axios.get(`${SongController.API_DEEZER}/${keyword}`)
                        .then(({ data }) => {
                            let songs  = data.data.map(song => {
                                let formatSong = {
                                    id: song.id,
                                    preview: song.preview
                                }
                                return formatSong
                            })
                            songs = SongController.randomSong(songs)
                            res.status(200).json({
                                songs
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                message : 'Internal Server Error'
                            })
                        })
                break
            default:
                    keyword = `playlist/${req.params.category}`
                    axios.get(`${SongController.API_DEEZER}/${keyword}`)
                        .then(({ data }) => {
                            let songs  = data.tracks.data.map(song => {
                                let formatSong = {
                                    id: song.id,
                                    preview: song.preview
                                }
                                return formatSong
                            })
                            songs = SongController.randomSong(songs)
                            res.status(200).json({
                                songs
                            })
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                message : 'Internal Server Error'
                            })
                        })
                break
        }
    }
}

module.exports = SongController