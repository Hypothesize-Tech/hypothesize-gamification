import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from 'three';

export const Sword3D = ({ rotation = [0, 0, 0] }: { rotation?: [number, number, number] | THREE.Euler }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state: any) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <group rotation={rotation as [number, number, number]}>
            <mesh ref={meshRef} position={[0, 0, 0]}>
                {/* Blade */}
                <mesh position={[0, 1.5, 0]}>
                    <boxGeometry args={[0.1, 3, 0.02]} />
                    <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Guard */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.8, 0.1, 0.1]} />
                    <meshStandardMaterial color="#8b6914" metalness={0.6} roughness={0.3} />
                </mesh>
                {/* Handle */}
                <mesh position={[0, -0.5, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 1]} />
                    <meshStandardMaterial color="#4a4a4a" />
                </mesh>
                {/* Pommel */}
                <mesh position={[0, -1, 0]}>
                    <sphereGeometry args={[0.1]} />
                    <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
                </mesh>
            </mesh>
        </group>
    );
};