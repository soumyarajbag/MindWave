'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AmbientScene as AmbientSceneType } from '@/types';
import * as THREE from 'three';

export default function AmbientScene({ scene }: { scene: AmbientSceneType }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        {scene.type === 'rain' && <RainScene />}
        {scene.type === 'cozy-room' && <CozyRoomScene />}
        {scene.type === 'lanterns' && <LanternsScene />}
        {scene.type === 'galaxy' && <GalaxyScene />}
        {scene.type === 'beach' && <BeachScene />}
      </Canvas>
    </div>
  );
}

function RainScene() {
  const particles = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (!particles.current) return;

    const geometry = new THREE.BufferGeometry();
    const count = 1000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.current.geometry = geometry;
    geometryRef.current = geometry;

    return () => {
      // Cleanup
      if (geometryRef.current) {
        geometryRef.current.dispose();
      }
    };
  }, []);

  useFrame((state) => {
    if (!particles.current || !geometryRef.current) return;

    const geometry = particles.current.geometry;
    if (!geometry || !geometry.attributes || !geometry.attributes.position) return;

    particles.current.rotation.y += 0.001;

    const positionAttribute = geometry.attributes.position;
    const positions = positionAttribute.array as Float32Array;

    if (positions && positions.length > 0) {
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.1;
        if (positions[i] < -10) positions[i] = 10;
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={particles}>
      <pointsMaterial size={0.05} color="#74B9FF" transparent opacity={0.6} />
    </points>
  );
}

function CozyRoomScene() {
  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#8B7355" />
    </mesh>
  );
}

function LanternsScene() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Lantern key={i} position={[(i - 2) * 2, 0, 0]} />
      ))}
    </>
  );
}

function Lantern({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
    </mesh>
  );
}

function GalaxyScene() {
  const particles = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (!particles.current) return;

    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.current.geometry = geometry;
    geometryRef.current = geometry;

    return () => {
      // Cleanup
      if (geometryRef.current) {
        geometryRef.current.dispose();
      }
    };
  }, []);

  useFrame(() => {
    if (!particles.current || !geometryRef.current) return;

    const geometry = particles.current.geometry;
    if (!geometry) return;

    particles.current.rotation.y += 0.0005;
  });

  return (
    <points ref={particles}>
      <pointsMaterial size={0.02} color="#FFFFFF" />
    </points>
  );
}

function BeachScene() {
  return (
    <>
      <mesh position={[0, -2, 0]}>
        <planeGeometry args={[10, 2]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
      <mesh position={[0, -1, 0]}>
        <planeGeometry args={[10, 1]} />
        <meshStandardMaterial color="#F4A460" />
      </mesh>
    </>
  );
}
