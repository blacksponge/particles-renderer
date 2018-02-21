'use strict'

class Camera {
  constructor (verticesData) {
    this.computePosition(verticesData)
  }

  computePosition (verticesData) {
    /*
    let res2 = vec3.create()
    for (let n = 0; n < 10; n++) {
      let res = vec3.create()
      for (let i = 0; i < 1000000; i++) {
        let norm = Camera.randomSurface(verticesData)
        vec3.normalize(norm, norm)
        vec3.add(res, norm, res)
        //console.log(`Getting random surface (${norm[0]}, ${norm[1]}, ${norm[2]}). New norm = (${res[0]}, ${res[1]}, ${res[2]})`)
      }
      vec3.normalize(res, res)
      vec3.add(res2, res2, res)
      console.log(`(${res[0]}, ${res[1]}, ${res[2]})`)
    }
    vec3.normalize(res2, res2)
    console.log(`Moyenne = (${res2[0]}, ${res2[1]}, ${res2[2]})`)
    */
    let target = vec3.create()
    for (let id = 0; id < verticesData.length; id += 3) {
      let currentVect = [verticesData[id], verticesData[id + 1], verticesData[id + 2]]
      vec3.add(target, target, currentVect)
    }
    vec3.scale(target, target, 3 / verticesData.length)
    this.target = target
    this.position = [5, 5, 5]
    this.up = [-1, -1, 1]
  }

  get view () {
    return mat4.lookAt(mat4.create(), this.position, this.target, this.up)
  }

  static randomSurface (verticesData) {
    let a = vec3.fromValues(...this.randomVertex(verticesData))
    let b = vec3.fromValues(...this.randomVertex(verticesData))
    let c = vec3.fromValues(...this.randomVertex(verticesData))

    let ab = vec3.create()
    let ac = vec3.create()
    let n = vec3.create()

    vec3.subtract(ab, b, a)
    vec3.subtract(ac, c, a)

    return vec3.cross(n, ab, ac)
  }

  static randomVertex (verticesData) {
    let verticesNb = verticesData.length / 3
    let vertexId = Math.floor(Math.random() * verticesNb)
    return [
      verticesData[vertexId * 3],
      verticesData[vertexId * 3 + 1],
      verticesData[vertexId * 3 + 2]
    ]
  }
}
