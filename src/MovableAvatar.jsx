import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three"; // Import THREE

const MovableAvatar = ({ position }) => {
  const avatarRef = useRef();
  const [currentAction, setCurrentAction] = useState("Idle");

  // Load the avatar model and animations
  const { scene, animations } = useGLTF(
    "https://models.readyplayer.me/67830ccfc3b7b7b28d00b478.glb" // Replace with your animated avatar model
  );
  const { actions } = useAnimations(animations, avatarRef);

  // Handle keyboard input for movement
  const keys = useRef({ forward: false, backward: false, left: false, right: false });
  const speed = 30; // Movement speed

  useFrame((state, delta) => {
    if (!avatarRef.current) return;

    const velocity = new THREE.Vector3();

    if (keys.current.forward) velocity.z -= speed * delta;
    if (keys.current.backward) velocity.z += speed * delta;
    if (keys.current.left) velocity.x -= speed * delta;
    if (keys.current.right) velocity.x += speed * delta;

    // Update avatar position
    avatarRef.current.position.add(velocity);

    // Play the appropriate animation
    const isMoving = keys.current.forward || keys.current.backward || keys.current.left || keys.current.right;
    const nextAction = isMoving ? "Walking" : "Idle";
    if (currentAction !== nextAction) {
      setCurrentAction(nextAction);
      actions[nextAction]?.reset().fadeIn(0.2).play();
    }
  });

  // Add event listeners for keypresses
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "w":
        keys.current.forward = true;
        break;
      case "s":
        keys.current.backward = true;
        break;
      case "a":
        keys.current.left = true;
        break;
      case "d":
        keys.current.right = true;
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.key) {
      case "w":
        keys.current.forward = false;
        break;
      case "s":
        keys.current.backward = false;
        break;
      case "a":
        keys.current.left = false;
        break;
      case "d":
        keys.current.right = false;
        break;
      default:
        break;
    }
  };

  // Attach event listeners to the window
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return <primitive ref={avatarRef} object={scene} position={position} scale={[100.1, 100.1, 100.1]} />;
};

export default MovableAvatar;
