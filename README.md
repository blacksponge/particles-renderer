# Particles renderer

Small project created to provide a client-side interface to http://github.com/ppsfleet/nbody.  

Client side, it uses vanilla WebGL to render the system of particles with glmatrix.js as an helper to manipulate matrix and vectors.
Also websockets, with socket.io, are used to provide server to client stream when the simulation starts.  

A configuration file, named `config.js` should be created in the `server` directory, the structure of the file is as follow :

```js

module.exports = {
  ssh: {
      // insert ssh configuration here
  },
  webPort: 3000,
  socketPort: 3001,
  socketIp: 'xx.xx.xx.xx' // external ip of the machine the server is running on
}

```

The ssh configuration format can be found at https://www.npmjs.com/package/simple-ssh.

To start the server execute first a `npm install` to fetch the dependencies then `node index.js`.
## References

https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext  
https://www.khronos.org/opengl/  
https://gpfault.net/posts/webgl2-particles.txt.html  
https://www.html5rocks.com/en/tutorials/pointerlock/intro/

http://expressjs.com/en/4x/api.html  
https://www.npmjs.com/package/simple-ssh
