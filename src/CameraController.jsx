import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from '@react-three/fiber';


const CameraController = () => {
    const [position, setPosition] = useState([0, 1.6, 10]);
    const [velocity, setVelocity] = useState([0, 0, 0]);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        switch (event.key) {
          case 'w':
            setVelocity([0, 0, -4]);
            break;
          case 's':
            setVelocity([0, 0, 4]);
            break;
          case 'a':
            setVelocity([-4, 0, 0]);
            break;
          case 'd':
            setVelocity([4, 0, 0]);
            break;
          default:
            break;
        }
      };
  
      const handleKeyUp = (event) => {
        switch (event.key) {
          case 'w':
          case 's':
          case 'a':
          case 'd':
            setVelocity([0, 0, 0]);
            break;
          default:
            break;
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);
  
    useFrame((state) => {
      state.camera.position.x += velocity[0];
      state.camera.position.y += velocity[1];
      state.camera.position.z += velocity[2];
    });
  
    return null;
  };

  export default CameraController;