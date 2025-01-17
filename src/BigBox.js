import { Text } from '@react-three/drei';

const BigBox = ({ position, onClick }) => {
    return (
      <mesh position={position} onClick={onClick}>
        <boxGeometry args={[400, 150, 5]} />
        <meshStandardMaterial color="blue" />
        <Text
          position={[0, 0, 3]} // Adjust position to place text on the box
          fontSize={35}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {"LinkedIn CareerVerse"}
        </Text>
      </mesh>
    );
  };


export default BigBox;