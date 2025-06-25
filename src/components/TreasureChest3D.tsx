import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from 'three';

export const TreasureChest3D = ({ isOpen = false }) => {
    const groupRef = useRef<THREE.Group>(null);
    const lidRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005;
        }
        if (lidRef.current && isOpen) {
            lidRef.current.rotation.x = Math.min(lidRef.current.rotation.x + 0.02, -0.5);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Chest base */}
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[2, 1, 1.5]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Chest lid */}
            <mesh ref={lidRef} position={[0, 0, -0.75]} rotation={[0, 0, 0]}>
                <boxGeometry args={[2, 0.5, 1.5]} />
                <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Gold coins inside */}
            {isOpen && (
                <group position={[0, -0.3, 0]}>
                    {[...Array(10)].map((_, i) => (
                        <mesh key={i} position={[
                            (Math.random() - 0.5) * 0.8,
                            Math.random() * 0.3,
                            (Math.random() - 0.5) * 0.6
                        ]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.02]} />
                            <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
                        </mesh>
                    ))}
                </group>
            )}
        </group>
    );
};