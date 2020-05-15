const express = require ('express')
const app = express()
const cors = require('cors')
const http = require('http') // bawaan node.js
const PORT = process.env.PORT || 3000 // Kita sebaiknya buat process.env. supaya bisa deploy nanti
const { Room } = require('./models')
const router = require('./routes/index.js')

const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(cors())
app.use(express.urlencoded ({ extended: false }))
app.use(express.json())


app.get('/', (req, res) => {res.json({ msg: "Deployment successfulgit"})})
app.use(router)

io.on('connection', function(socket) {
  console.log('User connected')

  // create
  // payload = { name, songs, players}
  // api request during room creation at client will get the required songs
  socket.on('createRoom', (payload) => {
    let { name, songs, players } = payload
    Room.create({
      name, songs, players
    })
    .then(room => {
      // socket.join(room.id, (err) => {
      //   if (err) console.log(err);
      //   else {
          console.log('Room created');
          socket.emit('createdRoom', room)
          Room.findAll()
            .then(rooms => {
              io.emit('showRooms', rooms)
            })
            .catch(err => console.log(err))
      //   }
      // })
    })
    .catch(err => console.log(err))          
  })

  // get all rooms
  socket.on('getRooms', () => {
    Room.findAll()
      .then(rooms => {
        io.emit('showRooms', rooms)
      })
      .catch(err => console.log(err))          
  })


  // add a player when joining
  // payload = { roomId, newPlayer = <string> }
  socket.on('addPlayer', (payload) => {
    const { roomId, newPlayer } = payload
    Room.findByPk(roomId)
      .then(room => {
        let { players } = room
        players.push(newPlayer)
        room.update({
          players 
        }, {
          where: { id: roomId },
          returning: true
        })
        .then(updated => {
          console.log('Player has been added to the room');
          io.emit('addedPlayer', updated)          
        })
        .catch(err => console.log(err))          
      })
      .catch(err => console.log(err))          
  })

  // delete game after the round is finished and winner announced
  // payload = { roomId }
  socket.on('deleteRoom', (payload) => {
    const { roomId } = payload
    Room.destroy({ where: { id: roomId }})
      .then( () => { console.log('Room has been deleted') })
      .catch( err => console.log(err))
  })


  socket.on('disconnect', function() {
    console.log('User disconnected')
  })
})

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})