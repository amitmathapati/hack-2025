import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
// import { PointerLockControls } from '@react-three/drei';
// import MovableAvatar from "./MovableAvatar";
import CameraController from "./CameraController";
import * as THREE from "three";
// import { mx_bilerp_1 } from "three/src/nodes/materialx/lib/mx_noise.js";
import Box from "./Box";
import Popup from "./Popup";
import DetailPopup from "./DetailPopup";
import VoiceChat from "./VoiceChat";
import './ThreeScene.css';
import SpeechBubble from "./SpeechBubble";
import BigBox from "./BigBox";

const Booth = ({ modelUrl, position }) => {
  const { scene } = useGLTF(modelUrl);
  // Enhance texture filtering
  scene.traverse((child) => {
    if (child.isMesh && child.material.map) {
      child.material.map.anisotropy = 16; // Maximize anisotropy for sharp textures
      child.material.map.magFilter = THREE.LinearFilter;
      child.material.map.minFilter = THREE.LinearMipmapLinearFilter;
    }
  });

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

  const [popupVisible, setPopupVisible] = useState(false);
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);
  const [detailText, setDetailText] = useState('');
  const [currentRows, setCurrentRows] = useState([]);
  const [livekitToken, setLivekitToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  // // const livekitServerUrl = 'wss://foobar-1-5i619deo.livekit.cloud';
  // const livekitServerUrl = 'wss://amitmathapati-1-pqsyvz6m.livekit.cloud';
  const livekitServerUrl =  process.env.LIVEKIT_SERVER_URL

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://localhost:3001/generate-token');
        const data = await response.text();
        setLivekitToken(data);
        console.log("Livekit token is: ", data);
        // setRoomName(data.room);
      } catch (error) {
        console.error('Error fetching LiveKit token:', error);
      }
    };

    fetchToken();
  }, []);



  const boxData = new Map([
    ['Meta', ['Privacy Engineer Implementation Review - Meta', 'Security Detection Engineer - Meta']],
    ['Databricks', ['Staff Software Engineer - Backend - Databricks', 'GenAI Senior Staff Machine Learning Engineer - Platform - Databricks']],
    ['Google', ['Senior Staff Software Engineering Manager - Youtube', 'Staff Software Engineer - Generative AI - Google Cloud AI']],
  ]);

  const handleBoxClick = (boxKey) => {
    setCurrentRows(boxData.get(boxKey) || []);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setDetailPopupVisible(false);
  };

  const handleRowClick = async (row) => {
    console.log("Row name is: ", row);
    const response = await fetch(`/details/${row}.txt`);
    const text = await response.text();
    setDetailText(text);
    setDetailPopupVisible(true);
  };

  const handleCloseDetailPopup = () => {
    setDetailPopupVisible(false);
  };


    return (
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ position: [-100, 150, 650], fov: 75, near: 0.1, far: 1000 }}
          gl={{
            antialias: true, // Enable antialiasing
            precision: "highp", // Use high precision for rendering
            logarithmicDepthBuffer: true, // Improves depth precision
          }}
          onCreated={({ gl }) => {
            gl.physicallyCorrectLights = true; // More realistic lighting
            // gl.outputEncoding = THREE.sRGBEncoding; // Better color rendering
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
          }}
        >
          <ambientLight intensity={0.5} />
          {/* <directionalLight castShadow position={[10, 10, 10]} intensity={0.8} /> */}
          <directionalLight
          castShadow
          position={[10, 10, 10]}
          intensity={0.8}
          shadow-mapSize-width={2048} // Increase shadow map resolution
          shadow-mapSize-height={2048}
          shadow-bias={-0.001} // Reduce shadow artifacts
        />
    
          {/* Ground */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#808080" />
          </mesh>

          <BigBox position={[-600, 150, -100]}/>
    
          {/* Booths */}
          {/* Clickable Box */}
          {/* <Box position={[-250, 200, -100]} onClick={() => handleBoxClick('Meta')} /> */}
          <Box position={[0, 350, -100]} onClick={() => handleBoxClick('Meta')} />
          {/* <SpeechBubble position={[-250, 200, -100]} onClick={() => handleBoxClick('Meta')} /> */}
          <Booth modelUrl="/models/15ftbooth-3/scene.gltf" position={[5, 0.1, -5]} scale={[0.1, 0.1, 0.1]} />

          {/* Clickable Box */}
          {/* <Box position={[500, 200, -100]} onClick={() => handleBoxClick('Databricks')} /> */}
          <Box position={[800, 350, -100]} onClick={() => handleBoxClick('Databricks')} />
          <Booth modelUrl="/models/15ftbooth/scene.gltf" position={[800, 0.1, 5]} scale={[0.1, 0.1, 0.1]} />

          {/* Clickable Box */}
          {/* <Box position={[1300, 200, -100]} onClick={() => handleBoxClick('Google')} /> */}
          <Box position={[1600, 350, -100]} onClick={() => handleBoxClick('Google')} />
          <Booth modelUrl="/models/15ftbooth-2/scene.gltf" position={[1600, 0.1, 5]} scale={[0.1, 0.1, 0.1]} />
          {/* <Booth modelUrl="/models/15ftbooth-2/scene.gltf" position={[5, 0.1, 500]} scale={[0.1, 0.1, 0.1]} rotation={[0, Math.PI, 0]} /> */}

          {/* Clickable Box */}
          {/* <Box position={[1900, 200, -100]} onClick={() => handleBoxClick('Meta')} />
          <Booth modelUrl="/models/15ftbooth-3/scene.gltf" position={[2200, 0.1, 5]} scale={[0.1, 0.1, 0.1]} /> */}

          {/* Movable Avatar */}
          {/* <MovableAvatar position={[10, 0.1, 100]} /> */}
          <CameraController />
    
          {/* <OrbitControls enableDamping dampingFactor={0.2} /> */}
          {/* <PointerLockControls /> */}
        </Canvas>

        {/* Popup */}
        <Popup visible={popupVisible} onClose={handleClosePopup} onRowClick={handleRowClick} rows={currentRows} />
        {/* Detail Popup */}
        <DetailPopup 
          visible={detailPopupVisible} onClose={() => setDetailPopupVisible(false)} text={detailText} token={livekitToken}
          serverUrl={livekitServerUrl} roomName={roomName}
        />
      </div>
    );
  };

export default ThreeScene;
