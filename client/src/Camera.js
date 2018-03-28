'use strict'

class Camera {
  constructor () {
    this.target = [0, 0, 0]
    this.position = [0, 0, 3]
    this.up = [0, 1, 0]
    gl.canvas.onmousemove = this.updateCameraDirection.bind(this)
  }


  get view () {
    return mat4.lookAt(mat4.create(), this.position, this.target, this.up)
  }

  updateCameraDirection (e) {
    if (e.buttons == 1 && e.shiftKey) {
      this.moveEyesPosition(-e.movementX / 300, e.movementY / 300)
    } else if (e.buttons == 1) {
      this.moveEyesAngle(e.movementX / 300, e.movementY / 300)
    }
  }

  moveEyesPosition (posx, posy) {
    let rightDirection = vec3.create()
    let frontDirection = vec3.create()

    vec3.subtract(frontDirection, this.target, this.position)
    vec3.normalize(frontDirection, frontDirection)

    vec3.cross(rightDirection, frontDirection, this.up)

    vec3.scaleAndAdd(this.position, this.position, this.up, posy)
    vec3.scaleAndAdd(this.target, this.target, this.up, posy)

    vec3.scaleAndAdd(this.position, this.position, rightDirection, posx)
    vec3.scaleAndAdd(this.target, this.target, rightDirection, posx)
  }

  moveEyesAngle (theta, phi) {
    let frontDirection = vec3.create()
    let rightDirection = vec3.create()

    let yawQ = quat.create()
    let pitchQ = quat.create()

    vec3.subtract(frontDirection, this.target, this.position)
    vec3.normalize(frontDirection, frontDirection)

    vec3.cross(rightDirection, frontDirection, this.up)

    quat.setAxisAngle(pitchQ, rightDirection, phi)
    quat.setAxisAngle(yawQ, this.up, theta)

    vec3.transformQuat(frontDirection, frontDirection, yawQ)
    vec3.transformQuat(frontDirection, frontDirection, pitchQ)
    vec3.add(this.target, this.position, frontDirection)
  }
}
