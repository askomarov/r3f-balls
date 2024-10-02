import * as THREE from 'three';
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Billboard,
  Box,
  Edges,
  OrbitControls,
  Sphere,
  Text,
  MeshReflectorMaterial,
} from "@react-three/drei";
import "./canvas.css";

const Scene = () => {
  const boxRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const radius = 10;
  useFrame((state) => {
    const time = state.clock.elapsedTime; // Получаем текущее время
    if (boxRef.current) {
      boxRef.current.rotation.y -= 0.02;
      boxRef.current.position.y = 3 * Math.cos(time);
    }
    if (sphereRef.current) {
      // sphereRef.current.rotation.y -= 0.01;
      sphereRef.current.position.x = radius * Math.sin(time);
      sphereRef.current.position.z = radius * Math.cos(time);
    }
  });

  return (
    <>
      <Sphere ref={sphereRef} args={[3, 32, 32]} rotation={[1, 0, 0]}>
        <meshStandardMaterial />
      </Sphere>
      <Box args={[1, 1, 1, 1]} ref={boxRef} rotation={[0, 0, 0]}>
        <meshNormalMaterial />
        <Edges linewidth={5} scale={1.5} threshold={10} color="white" />
      </Box>
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, 5, 0]}
      >
        <Text fontSize={1} color={"#ff0000"}>
          I'm a billboard
        </Text>
      </Billboard>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          mirror={5}
          resolution={2048}
          mixBlur={1}
          mixStrength={80}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
        />
      </mesh>
    </>
  );
};

const AppCanvas = () => {
  return (
    <div className="canvas-wrap">
      <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
        <color attach="background" args={["#333333"]} />
        <OrbitControls />

        <Scene />

        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      </Canvas>
    </div>
  );
};

export default AppCanvas;
