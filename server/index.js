const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const multer  = require('multer')
const upload = multer({dest: 'uploads'})
const child_process = require('child_process')
const fs = require('fs')

app.use(express.static('../client'))

app.post('/simulation', upload.single('dataset'), (req, res) => {
  let dataIn = fs.openSync(req.file.path, 'r')
  let args = [
    '-a', req.body.algorithm || 'bruteforce',
    '-n', req.body.nbIter || '2500',
    '-i', req.body.deltaT || '0.01'
  ]

  let simu = child_process.spawn('../../nbody/bin/nbody', args, {
    stdio: [dataIn, 'pipe', process.stdout]
  })

  simu.stdout.on('data', (data) => {
    res.write(data)
  })

  simu.on('close', (code) => {
    res.end()
  })
})

http.listen(3000, function(){
  console.log('listening on *:3000');
})
