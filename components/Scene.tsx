import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';


const CustomGridMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(0xffffff),
    emissive: new THREE.Color(0xffffff),
  });

const StarField: React.FC = () => {
  const count = 5000;
  const sphereRef = React.useRef<THREE.InstancedMesh>(null);

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
  

  React.useEffect(() => {
    if (sphereRef.current) {
      const tempObject = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        tempObject.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        tempObject.updateMatrix();
        sphereRef.current.setMatrixAt(i, tempObject.matrix);
      }
      sphereRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [positions]);

  return (
    <instancedMesh ref={sphereRef} args={[null, null, count]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial color="white" />
    </instancedMesh>
  );
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
        <group position={[0, 0, 0]}>
          {Array.from({ length: 21 }, (_, i) => (
            <line key={i}>
              <bufferGeometry>
                <bufferAttribute
                  attach="position"
                  array={Float32Array.from([
                    -10 + i,
                    0,
                    -10,
                    -10 + i,
                    0,
                    10,
                  ])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <primitive object={CustomGridMaterial} />
            </line>
          ))}
          {Array.from({ length: 21 }, (_, i) => (
            <line key={i}>
              <bufferGeometry>
                <bufferAttribute
                  attach="position"
                  array={Float32Array.from([
                    -10,
                    0,
                    -10 + i,
                    10,
                    0,
                    -10 + i,
                  ])}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <primitive object={CustomGridMaterial} />
            </line>
          ))}
        </group>
  
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
              intensity={1.0}
              luminanceThreshold={0.7}
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