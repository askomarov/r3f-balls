import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Box, Sphere } from "@react-three/drei";
import { useControls } from 'leva'
import "./canvas.css";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  RapierRigidBody
} from "@react-three/rapier";

interface BallProps {
  position?: [number, number, number];
  r?: (spread: number) => number;
  color?: string;
}

const Ball = ({
  position,
  r = THREE.MathUtils.randFloatSpread,
  color,
  ...props
}: BallProps) => {
  const ref = useRef<RapierRigidBody>(null);
  const vec = new THREE.Vector3();
  const pos: [number, number, number] = useMemo(
    () => position || [r(10), r(10), r(10)],
    [position, r]
  );
  // добавим силу котоорая будет притягивать мячи в центр сцены, чтобы они не улетали
  useFrame(() => {
    ref.current?.applyImpulse(
      vec.copy(ref.current.translation()).negate().multiplyScalar(1), true
    );
  });
  const normalMap = useLoader(THREE.TextureLoader, "./normal-map3.jpeg");

  return (
    <>
      <RigidBody
        ref={ref}
        type="dynamic"
        colliders={false}
        position={pos}
        linearDamping={4}
        angularDamping={1}
        friction={0.1}
        {...props}
      >
        <BallCollider args={[1]} />
        <Sphere
          castShadow
          receiveShadow
          args={[1, 32, 32]}
          rotation={[1, 0, 0]}
        >
          <meshStandardMaterial color={color} normalMap={normalMap} />
        </Sphere>
      </RigidBody>
    </>
  );
};

interface BoxProps {
  position?: [number, number, number];
  r?: (spread: number) => number;
  color?: string;
}

const BoxRigid = ({ position, color, ...props }: BoxProps) => {
  const ref = useRef<RapierRigidBody>(null);
  const r = THREE.MathUtils.randFloatSpread;
  const vec = new THREE.Vector3();
  const pos: [number, number, number] = useMemo(
    () => position || [r(10), r(10), r(10)],
    [position, r]
  );

  const [normalMap] = useLoader(THREE.TextureLoader, [
    "./PavingStones092_1K_Normal.jpg",
  ]);
  const size = 2;
  useFrame(() => {
    ref.current?.applyImpulse(
      vec.copy(ref.current.translation()).negate().multiplyScalar(1), true
    );
  });

  return (
    <>
      <RigidBody
        type="dynamic"
        ref={ref}
        colliders={false}
        position={pos}
        linearDamping={4}
        angularDamping={1}
        friction={0.1}
        {...props}
      >
        <CuboidCollider args={[size / 2, size / 2, size / 2]} />
        <Box castShadow receiveShadow args={[size, size, size]}>
          <meshStandardMaterial color={color} normalMap={normalMap} />
        </Box>
      </RigidBody>
    </>
  );
};

const Pointer = ({ vec = new THREE.Vector3() }) => {
  const ref = useRef<RapierRigidBody>(null);
  //size contols from 1 to 5
  const {size} = useControls({size: {value: 1, min: 1, max: 5}});
  useFrame(({ pointer, viewport }) =>
    ref.current?.setNextKinematicTranslation(
      vec.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      )
    )
  );
  return (
    <RigidBody
      ref={ref}
      position={[0, 0, 0]}
      type="kinematicPosition"
      colliders={false}
    >
      <BallCollider args={[size]} />
      <Sphere castShadow receiveShadow args={[size, 32, 32]} />
    </RigidBody>
  );
};

const Scene = () => {
  const colors: string[] = [
    "#4060ff",
    "#20ffa0",
    "#ff4060",
    "#ffcc00",
    "#ff00cc",
    "#00ffcc",
  ];
  return (
    <>
      <Pointer />
      {colors.map((color, index) => (
        <Ball key={index} color={color} />
      ))}
      {colors.map((color, index) => (
        <BoxRigid key={index} color={color} />
      ))}
    </>
  );
};

const AppCanvas = () => {
const {debug} = useControls({debug: false})
  return (
    <div className="canvas-wrap">
      <Canvas
        camera={{
          fov: 70,
          position: [0, 0, 15],
          rotation: [0, 0, 0],
        }}
        shadows
      >
        <color attach="background" args={["#333333"]} />
        {/* <OrbitControls /> */}
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]} debug={debug}>
            <Scene />
          </Physics>
        </Suspense>
        <ambientLight intensity={1} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
      </Canvas>
    </div>
  );
};

export default AppCanvas;
