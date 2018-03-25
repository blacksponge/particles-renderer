'use strict'

class Shader {
  static load (vertexName, fragmentName) {
    const vertexShader = this.loadShader(gl.VERTEX_SHADER, vertexName)
    const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fragmentName)

    const program = gl.createProgram()

    console.log('Association du vertex shader')
    gl.attachShader(program, vertexShader)
    console.log('Association du fragment shader')
    gl.attachShader(program, fragmentShader)

    console.log('Liage du programme')
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      let info = gl.getProgramInfoLog(program)
      console.error('Erreur lors du liage du programme : ' + info)
    }

    gl.detachShader(program, vertexShader)
    gl.detachShader(program, fragmentShader)

    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    return program
  }

  static loadShader (type, name) {
    const source = this.loadSrc(name)
    const shader = gl.createShader(type)

    console.log(`Chargement du shader ${name}`)
    gl.shaderSource(shader, source)
    console.log(`Compilation du shader ${name}`)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let info = gl.getShaderInfoLog(shader)
      console.error('Erreur lors de la compilation du shader : ' + info)
      return
    }
    return shader
  }

  static loadSrc (shaderName) {
    let el = document.getElementById(shaderName)
    return el.textContent.trim()
  }
}
