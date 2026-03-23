import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Crystal DNA (NeuroEntorno)
export const CrystalDNA = ({ isHovered }) => {
    const groupRef = useRef();
    
    const spheres = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 24; i++) {
            const y = (i - 12) * 0.15;
            const angle = i * 0.6;
            arr.push({ position: [Math.sin(angle) * 0.6, y, Math.cos(angle) * 0.6] });
            arr.push({ position: [-Math.sin(angle) * 0.6, y, -Math.cos(angle) * 0.6] });
        }
        return arr;
    }, []);

    useFrame(() => {
        if(groupRef.current) {
            groupRef.current.rotation.y += 0.015;
            const targetScale = isHovered ? 1.6 : 1;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            {spheres.map((s, i) => (
                <mesh key={i} position={s.position}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshPhysicalMaterial 
                        color="#66CCCC" 
                        transmission={0.9} 
                        opacity={1} 
                        metalness={0.2} 
                        roughness={0.1} 
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </mesh>
            ))}
        </group>
    );
};

// 2. Neural Graph (IA Lab)
export const NeuralGraph = ({ isHovered }) => {
    const groupRef = useRef();

    useFrame((state) => {
        if(groupRef.current) {
            groupRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
            // Morph/Explode Effect
            const targetScale = isHovered ? 1.5 : 1;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        }
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />
                <meshStandardMaterial 
                    color="#004B63" 
                    wireframe={true} 
                    emissive="#4DA8C4"
                    emissiveIntensity={0.8}
                />
            </mesh>
        </group>
    );
};

// 3. Light Constellations (Consultoría)
export const LightConstellation = ({ isHovered }) => {
    const ref = useRef();
    const points = useMemo(() => {
        const p = [];
        for(let i=0; i<40; i++) {
            p.push(new THREE.Vector3((Math.random()-0.5)*2.5, (Math.random()-0.5)*2.5, (Math.random()-0.5)*2.5));
        }
        return p;
    }, []);

    const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

    useFrame(() => {
        if(ref.current) {
            ref.current.rotation.y += 0.005;
            ref.current.rotation.z += 0.002;
            const targetScale = isHovered ? 1.4 : 1;
            ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <group ref={ref}>
            <points geometry={geometry}>
                <pointsMaterial size={0.1} color="#66CCCC" transparent opacity={0.9} sizeAttenuation />
            </points>
            <lineSegments>
                <edgesGeometry args={[new THREE.IcosahedronGeometry(1.2, 1)]} />
                <lineBasicMaterial color="#4DA8C4" transparent opacity={0.2} />
            </lineSegments>
            <lineSegments>
                <edgesGeometry args={[new THREE.OctahedronGeometry(0.8, 0)]} />
                <lineBasicMaterial color="#004B63" transparent opacity={0.4} />
            </lineSegments>
        </group>
    );
};
