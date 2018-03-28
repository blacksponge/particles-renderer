const gl = initGl('glCanvas')
let scene = initSimulation()
let system

loadData(loadDataInSimulation)

function initGl(id) {
  const canvas = document.getElementById('glCanvas')
  const gl = canvas.getContext('webgl2')

  if (!gl) {
    alert('WebGL not supported by browser.')
    return
  }

  return gl
}

function initSimulation() {
  let scene = new Scene()
  scene.initControl()
  scene.stop()
  let fpsCounter = document.getElementById('fps')
  setInterval(function () {
    fps.innerText = Math.round(scene.fps)
  }, 100);
  return scene
}

function loadData (callback) {
  let fileInput = document.getElementById('fileInput')

  fileInput.onchange = function fileChanged(e) {
    let file = e.target.files[0]
    let reader = new FileReader()

    reader.onload = (e) => {
      if (e.target.readyState !== 2 )
        return
      if (e.target.error) {
        console.log(e.target.error)
        return
      }
      callback(e.target.result)
    }
    reader.readAsText(file)
  }
}

function loadDataInSimulation (rawData) {
  let pos = rawData.trim().split(/\s/).map(Number)
  let nbParticles = pos.shift()
  let deltaT = pos.shift() * 1000

  if (pos.length % 3)
    pos = pos.slice(0, -pos.length % 3)

  scene.clear()
  system = new System('particle-vert', 'particle-frag', nbParticles)
  scene.deltaT = deltaT
  scene.add(system)
  scene.start()

  for (let i = 0; i < pos.length; i += nbParticles * 3) {
    system.addFrame(pos.slice(i, i + nbParticles * 3))
  }
}
