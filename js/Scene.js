'use strict'
class Scene {
  constructor () {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    this.objects = []
    this.running = false

    this.fov = 45
    this.zNear = 0.1
    this.zFar = 100.0

    this.lastRender = 0
    this.deltaT = 1000 / 30
    this.fps = 0

    this.view = mat4.fromTranslation(mat4.create(), [0.0, 0.0, -3.0])
  }

  add (object) {
    this.objects.push(object)
  }

  clear () {
    this.objects.length = 0
  }

  start () {
    if (!this.running) {
      this.paused = false
      this.running = true
      window.requestAnimationFrame(this.mainLoop.bind(this))
    }
  }

  stop () {
    this.running = false

    if (this.paused) {
      this.paused = false
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }
  }

  pause () {
    this.running = false
    this.paused = true
  }

  mainLoop (timestamp) {
    console.log('plop')
    if (timestamp >= this.lastRender + this.deltaT) {
      this.fps = 1000 / (timestamp - this.lastRender)
      this.lastRender = timestamp

      let projection = mat4.create()

      mat4.perspective(projection,
        this.fov,
        gl.canvas.clientWidth / gl.canvas.clientHeight,
        this.zNear,
        this.zFar)

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      for (let obj of this.objects) {
        obj.render(this.view, projection)
      }

      if (this.running) {
        window.requestAnimationFrame(this.mainLoop.bind(this))
      } else if (!this.paused) {
        // Clear après avoir stoppé
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      }
    }
  }

  initControl () {
    document.getElementById('play').onclick = this.start.bind(this)
    document.getElementById('stop').onclick = this.stop.bind(this)
    document.getElementById('pause').onclick = this.pause.bind(this)
  }
}
