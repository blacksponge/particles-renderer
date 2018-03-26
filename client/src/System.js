`use strict`

class System {
  constructor (vertexShaderName, fragmentShaderName, nbParticles) {
    this.nbParticles = nbParticles
    this.currentFrame = 0

    this.vertices = new Float32Array(150 * 3 * nbParticles)
    this.framesBuffer = new Array()

    this.shaderProgram = Shader.load(vertexShaderName, fragmentShaderName)

    // Allocation des VBO
    this.vbo = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    // Allocation des VAO
    this.vao =  gl.createVertexArray()
    const locPos = gl.getAttribLocation(this.shaderProgram, 'in_position')

    gl.bindVertexArray(this.vao)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        // Lien avec la variable 'in_position'
        gl.vertexAttribPointer(locPos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(locPos)

      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindVertexArray(null)

    this.genTexture()
  }

  addFrame(frame) {
    this.framesBuffer.push(frame)
  }

  updateVBO() {
    let newFrame
    if ((newFrame = this.framesBuffer.shift()) != undefined) {
      this.currentFrame ++
      // Shift the array by the size of a frame to the right
      this.vertices.copyWithin(3 * this.nbParticles)
      // Store the new frame vertices at the beginning the array
      this.vertices.set(newFrame)
      //console.log(newFrame, this.vertices)

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }
  }

  genColors () {
    let colorsData = []
    for (let i = 0; i < this.nbParticles; i++) {
      colorsData.push(64 + Math.random() * 192)
      colorsData.push(64 + Math.random() * 192)
      colorsData.push(64 + Math.random() * 192)
    }
    return new Uint8Array(colorsData)
  }

  genTexture () {
    this.colors = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.colors)
    let colorsData = this.genColors()
    gl.texImage2D(gl.TEXTURE_2D,
      0, // Level
      gl.RGB, // Internal format
      this.nbParticles, 1, // Size
      0, // Border
      gl.RGB, // Format
      gl.UNSIGNED_BYTE, //Type
      colorsData)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  render (view, projection, time, animated) {
    this.updateVBO()
    gl.useProgram(this.shaderProgram)
      gl.uniformMatrix4fv(
        gl.getUniformLocation(this.shaderProgram, 'u_view'),false, view)
      gl.uniformMatrix4fv(
        gl.getUniformLocation(this.shaderProgram, 'u_projection'), false, projection)

      gl.uniform1i(
        gl.getUniformLocation(this.shaderProgram, 'u_nbParticles'), this.nbParticles)

      gl.bindVertexArray(this.vao)
        gl.bindTexture(gl.TEXTURE_2D, this.colors)

        gl.drawArrays(gl.POINTS, 0, Math.min(this.currentFrame, 150) * this.nbParticles)

        gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindVertexArray(null)
    gl.useProgram(null)
  }
}
