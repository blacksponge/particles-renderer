const gl = initGl('glCanvas')
let scene = null

function initGl(id) {
  const canvas = document.getElementById('glCanvas')
  const gl = canvas.getContext('webgl2')

  if (!gl) {
    alert('WebGL not supported by browser.')
    return
  }

  loadData(initSimulation)

  return gl
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

function initSimulation (rawData) {
  let pos = rawData.trim().split(/\s/).map(Number)
  let nbParticles = pos.shift()
  let deltaT = pos.shift() * 1000

  if (pos.length % 3)
    pos = pos.slice(0, -pos.length % 3)

  scene = new Scene()
  let camera = new Camera(pos)
  scene.view = camera.view
  scene.add(new System(pos, 'particle-vert', 'particle-frag', nbParticles))
  scene.initControl()
}
