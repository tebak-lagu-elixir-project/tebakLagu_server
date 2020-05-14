const express = require ('express')
const app = express()
const cors = require('cors')
const http = require('http') // bawaan node.js
const PORT = process.env.PORT || 3000 // Kita sebaiknya buat process.env. supaya bisa deploy nanti

const server = http.createServer(app)
const io = require('socket.io')(server)

app.use(cors())
app.use(express.urlencoded ({ extended: false }))
app.use(express.json())

// io.on('connection'. function(socket) {
//   console.log('User connected')

//   socket.on('disconnect', function() {
//     console.log('User disconnected')
//   })
// })

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})