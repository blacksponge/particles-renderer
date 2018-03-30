const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const multer  = require('multer')
const upload = multer({dest: 'uploads'})
const child_process = require('child_process')
const fs = require('fs')
const net = require('net')
const SSH = require('simple-ssh')
const config = require('./config')

let ssh = new SSH(config.ssh)

let server = net.createServer((c) => {

  let nbParticles = 0
  let nbParticlesPosTot = 0
  let nbParticlesPos = 0
  let frame = null

  c.on('data', (data) => {
    console.log(nbParticles, data)
    console.log(data.length)
    if (nbParticles == 0) {
      nbParticles = data.readInt32BE(0)
      nbParticlesPosTot = nbParticles * 3
      frame = new Float64Array(nbParticlesPosTot)
      let opt = {
        nbParticles: nbParticles,
        deltaT: data.readDoubleLE(4)
      }
      console.log(opt)

      io.emit('start', opt)
      data = data.slice(12)
    }

    console.log(data.length)
    for (let i = 0; i < data.length; i += 8) {
      frame[nbParticlesPos] = data.readDoubleLE(i)
      console.log(nbParticlesPos, i)
      nbParticlesPos ++
      if (nbParticlesPos == nbParticlesPosTot) {
        nbParticlesPos = 0
        io.emit('out', [...frame])
      }
    }
    //io.emit('out', data)
  })
})

app.use(express.static('../client'))

app.post('/simulation', upload.single('dataset'), (req, res) => {
  let args = [
    '-a', req.body.algorithm || 'bruteforce',
    '-n', req.body.nbIter || '2500',
    '-i', req.body.deltaT || '0.01'
  ]
  let strArgs = args.join(' ')

  fs.readFile(req.file.path, {encoding: 'utf-8'}, (err, data) => {
    ssh.reset()
    ssh.exec(`cat > nbody-master/datasets/${req.file.filename}`, {
      in: data
    }).exec(`cat > job-${req.file.filename}.sh`, {
      in: `#!/bin/bash

#SBATCH -t 10:00
#SBATCH --job-name nbody
#SBATCH --mail-type BEGIN,END
#SBATCH --output=nbody.out
#SBATCH --error=nbody.err
#SBATCH

module load intel/2017

nbody-master/bin/nbody ${strArgs} -s ${config.socketIp} < nbody-master/datasets/${req.file.filename}
    `}).exec(`sbatch job-${req.file.filename}.sh`,{
      exit: ((code, out, err) => {
        if (code == 0) {
          let jobId = out.split(' ').slice(-1)
          res.status(202).json({jobId: Number(jobId)})
        } else {
          res.status(500).json({errorMsg: err.trim()})
        }
      })
    }).start()
  })
})

http.listen(config.webPort, () => {
  console.log(`web server listening on *:${config.webPort}`);
})
server.listen(3001, () => {
  console.log(`chaussette listening on *:${config.socketPort}`)
})
