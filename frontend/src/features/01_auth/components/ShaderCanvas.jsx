import { useEffect, useRef } from 'react';

const vsSource = `
  attribute vec2 a_position;
  varying vec2 v_texCoord;
  void main() {
    v_texCoord = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fsSource = `
  precision highp float;
  varying vec2 v_texCoord;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
      vec2 uv = (v_texCoord - 0.5) * 2.0;
      uv.x *= u_resolution.x / u_resolution.y;
      
      float d = length(uv);
      
      // Core pulsing orb
      float pulse = 0.8 + 0.1 * sin(u_time * 1.5);
      float glow = 0.04 / abs(d - 0.4 * pulse);
      
      // Rotating energy tendrils
      float angle = atan(uv.y, uv.x);
      float energy = 0.02 / abs(d - (0.45 + 0.05 * sin(angle * 5.0 + u_time * 2.0)));
      
      vec3 color = vec3(0.96, 0.77, 0.0); // FitAI Gold #F5C400
      vec3 finalColor = color * (glow + energy * 0.5);
      
      // Background noise
      float n = noise(uv + u_time * 0.1);
      finalColor += n * 0.02 * (1.0 - d);
      
      // Add a slight dark vignette at the very edge of the orb
      float mask = smoothstep(0.7, 0.2, d);
      
      gl_FragColor = vec4(finalColor * mask, 1.0);
  }
`;

export default function ShaderCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resizing function
    const syncSize = () => {
      const w = canvas.clientWidth || 256;
      const h = canvas.clientHeight || 256;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    // Resize observer
    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(syncSize);
      observer.observe(canvas);
    }
    syncSize();

    // WebGL Init
    let animId;
    let handleMouseMove;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const createShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('Shader compile error:', gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.useProgram(program);

          // Buffer setup
          const positionBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1,
          ]), gl.STATIC_DRAW);

          const positionLoc = gl.getAttribLocation(program, 'a_position');
          gl.enableVertexAttribArray(positionLoc);
          gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

          // Uniform setup
          const uTimeLoc = gl.getUniformLocation(program, 'u_time');
          const uResLoc = gl.getUniformLocation(program, 'u_resolution');
          const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');

          let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

          handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width && rect.height) {
              const nx = (e.clientX - rect.left) / rect.width;
              const ny = 1.0 - (e.clientY - rect.top) / rect.height;
              mouse.x = nx * canvas.width;
              mouse.y = ny * canvas.height;
            }
          };

          window.addEventListener('mousemove', handleMouseMove);

          const render = (time) => {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform1f(uTimeLoc, time * 0.001);
            gl.uniform2f(uResLoc, canvas.width, canvas.height);
            gl.uniform2f(uMouseLoc, mouse.x, mouse.y);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animId = requestAnimationFrame(render);
          };

          animId = requestAnimationFrame(render);
        } else {
          console.error('Program link error:', gl.getProgramInfoLog(program));
        }
      }
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`block w-full h-full ${className}`} 
    />
  );
}
