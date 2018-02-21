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

    this.startTime = 0.0

    this.view = mat4.fromTranslation(mat4.create(), [0.0, 0.0, -3.0])
  }

  add (object) {
    this.objects.push(object)
  }

  start () {
    if (!this.running) {
      if (!this.paused) {
        this.startTime = 0.0
      } else {
        let now = Date.now()
        this.startTime += now - this.pausedTime
        this.paused = false
      }
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
    this.pausedTime =  Date.now()
  }

  mainLoop (timestamp) {
    if(!this.startTime) {
      this.startTime = timestamp
    }

    let elapsedTime = timestamp - this.startTime
    let projection = mat4.create()

    mat4.perspective(projection,
      this.fov,
      gl.canvas.clientWidth / gl.canvas.clientHeight,
      this.zNear,
      this.zFar)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    for (let obj of this.objects) {
      obj.render(this.view, projection, elapsedTime)
    }

    if (this.running) {
      window.requestAnimationFrame(this.mainLoop.bind(this))
    } else if (!this.paused) {
      // Clear après avoir stoppé
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }
  }

  initControl () {
    document.getElementById('play').onclick = this.start.bind(this)
    document.getElementById('stop').onclick = this.stop.bind(this)
    document.getElementById('pause').onclick = this.pause.bind(this)
  }
}
