import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

const MODEL_PATH = '/Stylized Emerald Sword.glb';

function useWebGLErrorHandling() {
    const { gl } = useThree();

    useEffect(() => {
        const canvas = gl.domElement;

        const handleContextLost = (event: Event) => {
            event.preventDefault();
            console.log('WebGL context lost, attempting to restore...');
        };

        const handleContextRestored = () => {
            console.log('WebGL context restored');
        };

        canvas.addEventListener('webglcontextlost', handleContextLost, false);
        canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

        return () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        };
    }, [gl]);
}

type DiamondSword3DProps = {
    rotation?: [number, number, number] | THREE.Euler;
    scale?: [number, number, number];
    spinSpeed?: number;
    floatAmplitude?: number;
    // Add these to adjust the sword's standing orientation
    standingRotation?: {
        x?: number;
        y?: number;
        z?: number;
    };
};

const DiamondSword3D: React.FC<DiamondSword3DProps> = ({
    rotation = [0, 0, 0],
    scale = [2, 2, 2],
    spinSpeed = 0.01,
    floatAmplitude = 0.1,
    standingRotation = { x: 0, y: 0, z: Math.PI / 2 }, // Default: rotate 90° on Z
}) => {
    useWebGLErrorHandling();
    const group = useRef<THREE.Group>(null);
    const swordRef = useRef<THREE.Group>(null);

    // Load the GLTF model
    const gltf = useLoader(GLTFLoader, MODEL_PATH);

    // Set the sword to stand vertically on load
    React.useEffect(() => {
        if (swordRef.current) {
            // Apply the standing rotation to orient the sword vertically
            swordRef.current.rotation.x = standingRotation.x || 0;
            swordRef.current.rotation.y = standingRotation.y || 0;
            swordRef.current.rotation.z = standingRotation.z || 0;
        }
    }, [standingRotation]);

    // Animate the sword: spin around its vertical axis
    useFrame((state) => {
        if (group.current) {
            // Spin around Y axis (the vertical axis)
            group.current.rotation.y += spinSpeed;

            // Optional: Gentle floating motion
            if (floatAmplitude > 0) {
                group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * floatAmplitude;
            }
        }
    });

    return (
        <group ref={group} rotation={rotation} scale={scale}>
            <group ref={swordRef}>
                <primitive object={gltf.scene} />
            </group>
        </group>
    );
};

export default DiamondSword3D;