import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BackgroundShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorPetroleum: { value: new THREE.Color('#004B63') },
    uColorMint: { value: new THREE.Color('#66CCCC') },
    uBgWhite: { value: new THREE.Color('#FFFFFF') },
    uBgBone: { value: new THREE.Color('#F8FAFC') }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorPetroleum;
    uniform vec3 uColorMint;
    uniform vec3 uBgWhite;
    uniform vec3 uBgBone;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Soft background gradient
      vec3 bgColor = mix(uBgWhite, uBgBone, vUv.y);
      
      // Abstract fluid motion from noise
      float noise1 = snoise(vUv * 3.0 + uTime * 0.05);
      float noise2 = snoise(vUv * 2.0 - uTime * 0.07);
      
      float mixAmt = (noise1 + noise2) * 0.5 + 0.5;
      vec3 fluidColor = mix(uColorPetroleum, uColorMint, mixAmt);
      
      // Fast, subtle grain layer
      float grain = snoise(vUv * 200.0 + uTime * 5.0);
      
      // Combine background, very faint fluid, and grain
      vec3 finalColor = mix(bgColor, fluidColor, 0.015 + grain * 0.005);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

const BackgroundQuad = () => {
    const materialRef = useRef();
    
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial 
                ref={materialRef}
                uniforms={BackgroundShaderMaterial.uniforms}
                vertexShader={BackgroundShaderMaterial.vertexShader}
                fragmentShader={BackgroundShaderMaterial.fragmentShader}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
};

export default function GlobalCanvas() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
                <BackgroundQuad />
            </Canvas>
        </div>
    );
}
