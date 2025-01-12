// ThreeScene.jsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Avatar = () => {
  const avatarRef = useRef();
  const { scene } = useGLTF("https://models.readyplayer.me/67830ccfc3b7b7b28d00b478.glb"); // Replace with your URL

  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.scale.set(1.5, 1.5, 1.5);
      avatarRef.current.position.set(0, 0, -5);
    }
  }, []);

  return <primitive object={scene} ref={avatarRef} />;
};

const Booth = ({ position, onClick }) => {
  return (
    <mesh position={position} onClick={onClick}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

const ThreeScene = () => {
  const handleBoothClick = () => {
    alert("Welcome to the booth! Here’s more info...");
  };

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 10]} intensity={0.5} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#808080" />
      </mesh>

      {/* Avatar */}
      <Avatar />

      {/* Booth */}
      <Booth position={[5, 1, -5]} onClick={handleBoothClick} />

      {/* Controls */}
      <OrbitControls />
    </Canvas>
  );
};

export default ThreeScene;
