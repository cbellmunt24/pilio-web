class ButterflyVideo {
  constructor(container, videoPath) {
    this.container = container;
    this.videoPath = videoPath;
    this.canvas = null;
    this.video = null;
    this.gl = null;
    this.program = null;
    this.texture = null;
    this.animationFrameId = null;
    this.movementFrameId = null;
    this.isPlaying = false;
    this.chromaThreshold = 0.85;
    this.edgeSmoothing = 0.15;
    this.cropLeft = 0.2;
    this.movementTime = 0;
    this.movementAmplitude = 25;
    this.movementSpeed = 0.6;
    this.flightPath = 0;
    this.flightCycle = 0;
    
    this.init();
  }

  init() {
    this.createVideoElement();
    this.createCanvas();
    const webglAvailable = this.initWebGL();
    this.setupVideo();
    if (webglAvailable) {
      this.startRender();
    }
    this.startMovement();
    this.setupVisibilityObserver();
  }

  createVideoElement() {
    this.video = document.createElement('video');
    this.video.id = 'butterfly-video-source';
    this.video.src = this.videoPath;
    this.video.loop = true;
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.preload = 'auto';
    this.video.style.display = 'none';
    this.video.setAttribute('playsinline', '');
    document.body.appendChild(this.video);
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'butterfly-video-canvas';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.position = 'relative';
    this.canvas.style.zIndex = '2';
    this.canvas.style.willChange = 'transform';
    this.canvas.style.transform = 'translateZ(0)';
    this.canvas.style.transition = 'none';
    
    if (this.container) {
      this.container.innerHTML = '';
      this.container.appendChild(this.canvas);
    }
  }

  initWebGL() {
    const gl = this.canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
      antialias: true
    });

    if (!gl) {
      console.warn('WebGL no disponible, usando fallback Canvas 2D');
      this.initCanvas2DFallback();
      return false;
    }

    this.gl = gl;
    this.setupShaders();
    this.setupGeometry();
    return true;
  }

  setupShaders() {
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_threshold;
      uniform float u_edgeSmoothing;
      uniform float u_cropLeft;
      varying vec2 v_texCoord;
      
      void main() {
        vec2 texCoord = v_texCoord;
        texCoord.x = u_cropLeft + (texCoord.x * (1.0 - u_cropLeft));
        
        vec4 color = texture2D(u_texture, texCoord);
        float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        float alpha = 1.0;
        
        if (brightness > u_threshold) {
          float edge = smoothstep(u_threshold, u_threshold + u_edgeSmoothing, brightness);
          alpha = 1.0 - edge;
        }
        
        float grayValue = (color.r + color.g + color.b) / 3.0;
        if (grayValue > u_threshold && abs(color.r - color.g) < 0.1 && abs(color.g - color.b) < 0.1) {
          float edge = smoothstep(u_threshold, u_threshold + u_edgeSmoothing, grayValue);
          alpha = 1.0 - edge;
        }
        
        gl_FragColor = vec4(color.rgb, alpha);
      }
    `;

    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Error linking shader program:', this.gl.getProgramInfoLog(this.program));
      this.initCanvas2DFallback();
      return;
    }

    this.gl.useProgram(this.program);
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Error compiling shader:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  setupGeometry() {
    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]), this.gl.STATIC_DRAW);

    const texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      0, 0,
      1, 1,
      1, 0
    ]), this.gl.STATIC_DRAW);

    this.positionLocation = positionLocation;
    this.texCoordLocation = texCoordLocation;
    this.positionBuffer = positionBuffer;
    this.texCoordBuffer = texCoordBuffer;
  }

  setupVideo() {
    this.video.addEventListener('loadedmetadata', () => {
      this.updateCanvasSize();
    });

    this.video.addEventListener('canplay', () => {
      if (this.gl) {
        this.createTexture();
      }
      if (!this.isPlaying) {
        this.video.play().catch(err => {
          console.warn('Error al reproducir video:', err);
        });
        this.isPlaying = true;
      }
    });

    this.video.addEventListener('ended', () => {
      this.video.currentTime = 0;
      this.video.play();
    });

    this.video.load();
  }

  updateCanvasSize() {
    const containerRect = this.container.getBoundingClientRect();
    const videoAspect = this.video.videoWidth / this.video.videoHeight;
    const containerAspect = containerRect.width / containerRect.height;

    let width, height;
    if (videoAspect > containerAspect) {
      width = containerRect.width;
      height = containerRect.width / videoAspect;
    } else {
      width = containerRect.height * videoAspect;
      height = containerRect.height;
    }

    this.canvas.width = width;
    this.canvas.height = height;

    if (this.gl) {
      this.gl.viewport(0, 0, width, height);
    }
  }

  createTexture() {
    if (!this.gl) return;

    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  }

  render() {
    if (!this.gl || !this.texture || this.video.readyState < 2) {
      return;
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.video);

    this.gl.useProgram(this.program);

    const thresholdLocation = this.gl.getUniformLocation(this.program, 'u_threshold');
    const edgeSmoothingLocation = this.gl.getUniformLocation(this.program, 'u_edgeSmoothing');
    const cropLeftLocation = this.gl.getUniformLocation(this.program, 'u_cropLeft');
    this.gl.uniform1f(thresholdLocation, this.chromaThreshold);
    this.gl.uniform1f(edgeSmoothingLocation, this.edgeSmoothing);
    this.gl.uniform1f(cropLeftLocation, this.cropLeft);

    const textureLocation = this.gl.getUniformLocation(this.program, 'u_texture');
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.uniform1i(textureLocation, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.enableVertexAttribArray(this.texCoordLocation);
    this.gl.vertexAttribPointer(this.texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  startRender() {
    let lastTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;
    
    const renderLoop = (currentTime) => {
      if (this.video && this.video.readyState >= 2) {
        const delta = currentTime - lastTime;
        if (delta >= frameTime) {
          this.render();
          lastTime = currentTime - (delta % frameTime);
        }
      }
      this.animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop(0);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateCanvasSize();
      }, 100);
    });
  }

  startMovement() {
    let lastTime = performance.now();
    
    const movementLoop = (currentTime) => {
      if (!this.canvas) {
        this.movementFrameId = requestAnimationFrame(movementLoop);
        return;
      }

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      this.movementTime += delta * this.movementSpeed;
      this.flightPath += delta * 0.4;
      this.flightCycle += delta * 0.3;

      // Patrón de vuelo en forma de "8" o infinito (movimiento cíclico principal)
      const figure8X = Math.sin(this.flightPath) * this.movementAmplitude;
      const figure8Y = Math.sin(this.flightPath * 2) * this.movementAmplitude * 0.5;
      
      // Movimiento ascendente/descendente cíclico (ondulación)
      const verticalWave = Math.sin(this.movementTime * 0.8) * this.movementAmplitude * 0.4;
      
      // Movimiento lateral suave adicional
      const horizontalDrift = Math.cos(this.movementTime * 0.6) * this.movementAmplitude * 0.3;
      
      // Combinación de movimientos para crear patrón de vuelo realista
      const x = figure8X + horizontalDrift;
      const y = figure8Y + verticalWave;
      
      // Rotación más suave que sigue el movimiento
      const rotationX = Math.sin(this.flightPath * 1.2) * 4;
      const rotationY = Math.cos(this.flightPath * 0.8) * 2;
      const rotation = rotationX + rotationY;
      
      // Escala que pulsa sutilmente con el aleteo
      const scaleVariation = Math.sin(this.movementTime * 1.5) * 0.015;
      const scale = 1 + scaleVariation;
      
      // Aplicar transformación con perspectiva 3D
      this.canvas.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;

      this.movementFrameId = requestAnimationFrame(movementLoop);
    };
    movementLoop(performance.now());
  }

  initCanvas2DFallback() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const render2D = () => {
      if (this.video.readyState >= 2) {
        this.updateCanvasSize();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        
        const sourceX = this.video.videoWidth * this.cropLeft;
        const sourceWidth = this.video.videoWidth * (1 - this.cropLeft);
        ctx.drawImage(
          this.video,
          sourceX, 0, sourceWidth, this.video.videoHeight,
          0, 0, this.canvas.width, this.canvas.height
        );
        
        const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        const cropLeftPixels = Math.floor(this.canvas.width * this.cropLeft);
        
        for (let y = 0; y < this.canvas.height; y++) {
          for (let x = cropLeftPixels; x < this.canvas.width; x++) {
            const i = (y * this.canvas.width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            const grayValue = (r + g + b) / 3 / 255;

            if (brightness > this.chromaThreshold || (grayValue > this.chromaThreshold && Math.abs(r - g) < 25 && Math.abs(g - b) < 25)) {
              const edge = Math.min(1.0, (Math.max(brightness, grayValue) - this.chromaThreshold) / this.edgeSmoothing);
              const alpha = 1.0 - edge;
              data[i + 3] = Math.floor(alpha * 255);
            }
          }
          
          for (let x = 0; x < cropLeftPixels; x++) {
            const i = (y * this.canvas.width + x) * 4;
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }
      requestAnimationFrame(render2D);
    };

    this.video.addEventListener('loadedmetadata', () => {
      this.updateCanvasSize();
    });

    this.video.addEventListener('canplay', () => {
      if (!this.isPlaying) {
        this.video.play().catch(err => {
          console.warn('Error al reproducir video:', err);
        });
        this.isPlaying = true;
      }
      render2D();
    });

    this.video.load();
  }

  setupVisibilityObserver() {
    if ('IntersectionObserver' in window) {
      let isVisible = true;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting && entry.intersectionRatio > 0.3;
          
          if (isVisible && !wasVisible) {
            if (this.video.paused) {
              this.video.play().catch(() => {});
            }
          } else if (!isVisible && wasVisible && entry.intersectionRatio < 0.1) {
            this.video.pause();
          }
        });
      }, { 
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0],
        rootMargin: '50px'
      });

      if (this.container) {
        observer.observe(this.container);
      }
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.movementFrameId) {
      cancelAnimationFrame(this.movementFrameId);
    }

    if (this.video) {
      this.video.pause();
      this.video.src = '';
      this.video.load();
      if (this.video.parentNode) {
        this.video.parentNode.removeChild(this.video);
      }
    }

    if (this.gl && this.texture) {
      this.gl.deleteTexture(this.texture);
    }

    if (this.program && this.gl) {
      this.gl.deleteProgram(this.program);
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
