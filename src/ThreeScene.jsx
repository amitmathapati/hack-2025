import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { PointerLockControls } from '@react-three/drei';
import MovableAvatar from "./MovableAvatar";
import CameraController from "./CameraController";
import * as THREE from "three";
import { mx_bilerp_1 } from "three/src/nodes/materialx/lib/mx_noise.js";

const Booth = ({ modelUrl, position }) => {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} position={position} scale={[0.1, 0.1, 0.1]} castShadow />;
};

// const Avatar = ({ position }) => {
//   const avatarRef = useRef();
//   const { scene } = useGLTF("https://models.readyplayer.me/67830ccfc3b7b7b28d00b478.glb"); // Replace with your Ready Player Me avatar URL
//   const { scene } = useGLTF("/avatar/model-walk-1.glb"); // Replace with your Ready Player Me avatar URL
//   const { scene } = useGLTF("/avatar/man-2.glb"); // Replace with your Ready Player Me avatar URL

//   useFrame(() => {
//     if (avatarRef.current) {
//       avatarRef.current.position.set(position.x, 0, position.z);
//     }
//   });

//   return <primitive object={scene} ref={avatarRef} scale={[100.8, 100.8, 100.8]} />;
// };

// const ThreeScene = () => {
//   const [avatarPosition, setAvatarPosition] = useState({ x: -10, z: 100 });

//   const handleKeyDown = (event) => {
//     setAvatarPosition((prev) => {
//       const newPos = { ...prev };
//       const step = 0.5;

//       switch (event.key) {
//         case "ArrowUp":
//         case "w":
//           newPos.z -= step;
//           break;
//         case "ArrowDown":
//         case "s":
//           newPos.z += step;
//           break;
//         case "ArrowLeft":
//         case "a":
//           newPos.x -= step;
//           break;
//         case "ArrowRight":
//         case "d":
//           newPos.x += step;
//           break;
//         default:
//           break;
//       }
//       return newPos;
//     });
//   };

//   React.useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   return (
//     <Canvas shadows camera={{ position: [0, 5, 10], fov: 75, near: 0.1, far: 1000 }}>
//       {/* Lighting */}
//       <ambientLight intensity={0.5} />
//       <directionalLight castShadow position={[10, 10, 10]} intensity={0.8} />

//       {/* Floor */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
//         <planeGeometry args={[50, 50]} />
//         <meshStandardMaterial color="#808080" />
//       </mesh>

//       {/* Avatar */}
//       <Avatar position={avatarPosition} />

//       {/* Booths */}
//       <Booth modelUrl="/models/scene.gltf" position={[5, 0.1, -5]} scale={[0.1, 0.1, 0.1]}/>
//       {/* <Booth modelUrl="/models/scene.gltf" position={[-5, 0, -5]} />
//       <Booth modelUrl="/models/scene.gltf" position={[0, 0, -10]} /> */}

//       {/* Controls */}
//       <OrbitControls />
//     </Canvas>
//   );
// };


const ThreeScene = () => {


    return (
      <Canvas
        shadows
        // camera={{ position: [300, 5, 15], fov: 50, near: 0.1, far: 1000 }}
        camera={{ position: [-100, 150, 650], fov: 50, near: 0.1, far: 1000 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[10, 10, 10]} intensity={0.8} />
  
        {/* Ground */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
  
        {/* Booths */}
        <Booth modelUrl="/models/scene.gltf" position={[5, 0.1, -5]} scale={[0.1, 0.1, 0.1]} />
        <Booth modelUrl="/models/15ftbooth/scene.gltf" position={[600, 0.1, 5]} scale={[0.1, 0.1, 0.1]} />
        <Booth modelUrl="/models/15ftbooth-2/scene.gltf" position={[1600, 0.1, 5]} scale={[0.1, 0.1, 0.1]} />
        {/* <Booth modelUrl="/models/15ftbooth-2/scene.gltf" position={[5, 0.1, 500]} scale={[0.1, 0.1, 0.1]} rotation={[0, Math.PI, 0]} /> */}

  
        {/* Movable Avatar */}
        {/* <MovableAvatar position={[10, 0.1, 100]} /> */}
        <CameraController />
  
        {/* <OrbitControls enableDamping dampingFactor={0.2} /> */}
        <PointerLockControls />
      </Canvas>
    );
  };

export default ThreeScene;
