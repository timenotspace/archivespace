import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';

const StarField: React.FC = () => {
  const count = 5000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const radius = 100;

    for (let i = 0; i < count * 3; i += 3) {
      const r = radius * Math.random();
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);
    }

    return pos;
  }, []);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ size: 0.15, color: 'white' });

  return <points geometry={geometry} material={material} />;
};

const MainScene: React.FC = () => {
  return (
    <>
      <StarField />

      {/* Middle orb */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={new THREE.Color(0xffffff)} />
      </mesh>

      {/* Grid plane */}
      <Grid args={[10, 10]} color="#ffffff" />

      {/* Add a light source */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
    </>
  );
};

const Scene: React.FC = () => {
  return (
    <div className="canvas-container">
      <Canvas>
        <MainScene />
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.1}
            height={300}
          />
        </EffectComposer>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene;
