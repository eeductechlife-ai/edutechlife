import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSphere = () => {
    const pointsRef = useRef();
    const materialRef = useRef();
    const { mouse } = useThree();

    // Create icosahedron geometry to get vertices for particles
    const particles = useMemo(() => {
        const geo = new THREE.IcosahedronGeometry(1.5, 12);
        const positions = geo.attributes.position.array;
        
        const jitteredPositions = new Float32Array(positions.length);
        const originalPositions = new Float32Array(positions.length);
        const randoms = new Float32Array(positions.length / 3);

        for(let i = 0; i < positions.length; i += 3) {
            // Apply jitter to make it organic rather than perfectly geometric
            jitteredPositions[i] = positions[i] + (Math.random() - 0.5) * 0.1;
            jitteredPositions[i+1] = positions[i+1] + (Math.random() - 0.5) * 0.1;
            jitteredPositions[i+2] = positions[i+2] + (Math.random() - 0.5) * 0.1;

            originalPositions[i] = jitteredPositions[i];
            originalPositions[i+1] = jitteredPositions[i+1];
            originalPositions[i+2] = jitteredPositions[i+2];
            
            randoms[i/3] = Math.random();
        }

        return { positions: jitteredPositions, originalPositions, randoms };
    }, []);

    const shaderArgs = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector3(0, 0, 0) },
            uColor1: { value: new THREE.Color('#4DA8C4') },
            uColor2: { value: new THREE.Color('#004B63') }
        },
        vertexShader: `
            uniform float uTime;
            uniform vec3 uMouse;
            attribute vec3 originalPosition;
            attribute float aRandom;
            varying vec3 vColor;
            uniform vec3 uColor1;
            uniform vec3 uColor2;

            void main() {
                vec3 pos = originalPosition;
                
                // Organic floating effect
                pos.y += sin(uTime * 2.0 + pos.x * 3.0) * 0.05 * aRandom;
                pos.x += cos(uTime * 1.5 + pos.y * 3.0) * 0.05 * aRandom;

                // Mouse repulsion
                // Transform mouse coordinate space
                float dist = distance(pos.xy, uMouse.xy * 2.5);
                float repelForce = max(0.0, 1.0 - dist);
                vec3 dir = normalize(pos - vec3(uMouse.xy * 2.5, 0.0));
                
                // Push particles away smoothly
                pos += dir * repelForce * 0.4;

                // Color mix based on depth and random
                vColor = mix(uColor1, uColor2, pos.z * 0.5 + 0.5 + aRandom * 0.2);

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Point size based on depth to emphasize 3D
                gl_PointSize = (4.0 + aRandom * 4.0) * (1.0 / -mvPosition.z);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                // Circular particle with soft edge
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                if(dist > 0.5) discard;
                
                float alpha = smoothstep(0.5, 0.2, dist);
                gl_FragColor = vec4(vColor, alpha * 0.85);
            }
        `
    }), []);

    useFrame((state) => {
        if(materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            // Smooth mouse interpolation
            materialRef.current.uniforms.uMouse.value.lerp(
                new THREE.Vector3(state.mouse.x, state.mouse.y, 0),
                0.1
            );
        }
        if(pointsRef.current) {
            // Constant rotation
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
                <bufferAttribute attach="attributes-originalPosition" count={particles.originalPositions.length / 3} array={particles.originalPositions} itemSize={3} />
                <bufferAttribute attach="attributes-aRandom" count={particles.randoms.length} array={particles.randoms} itemSize={1} />
            </bufferGeometry>
            <shaderMaterial 
                ref={materialRef}
                args={[shaderArgs]}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default function NeuralOracle() {
    return (
        <div className="w-full h-[500px] md:h-[600px] relative z-10 perspective-1000 cursor-none">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 2]}>
                <ParticleSphere />
            </Canvas>
        </div>
    );
}
