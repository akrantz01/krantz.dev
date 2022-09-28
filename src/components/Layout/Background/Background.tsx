import { Camera, Color, Geometry, Mesh, Program, Renderer } from 'ogl-typescript';
import { useRef } from 'react';
import { useEffectOnce } from 'react-use';

import { colors } from '@/lib';

import FragmentShader from './fragment.glsl';
import VertexShader from './vertex.glsl';

const NUM_PARTICLES = 100;

export const Background = (): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffectOnce(() => {
    const renderer = new Renderer({ depth: false, dpr: 2, alpha: true });
    const gl = renderer.gl;

    const camera = new Camera(gl, { fov: 15 });
    camera.position.z = 15;

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };

    try {
      // Add the canvas, ensuring there is only one canvas at any given time
      while (ref.current?.hasChildNodes()) {
        // @ts-ignore
        ref.current?.removeChild(ref.current?.lastChild);
      }
      ref.current?.appendChild(gl.canvas);

      gl.clearColor(0, 0, 0, 0);

      window.addEventListener('resize', onResize, false);
      onResize();
    } catch (e) {
      console.error(`failed to initialize canvas: ${e}`);
    }

    // Position the dots
    const position = new Float32Array(NUM_PARTICLES * 3);
    const random = new Float32Array(NUM_PARTICLES * 4);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      position.set([Math.random(), Math.random(), Math.random()], i * 3);
      random.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    }

    const geometry = new Geometry(gl, { position: { size: 3, data: position }, random: { size: 4, data: random } });

    const program = new Program(gl, {
      vertex: VertexShader,
      fragment: FragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(colors.primary[600]) },
      },
      transparent: true,
      depthTest: false,
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    // Render loop
    let frameId = 1;

    const update = (time: number): void => {
      frameId = requestAnimationFrame(update);

      particles.rotation.z += 0.0025;
      program.uniforms.uTime.value = time * 0.00025;

      renderer.render({ scene: particles, camera });
    };
    frameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frameId);
  });

  return <div className="fixed inset-0" ref={ref}></div>;
};
