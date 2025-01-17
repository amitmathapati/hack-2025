import { Text } from '@react-three/drei';

const Box = ({ position, onClick }) => {
    return (
      <mesh position={position} onClick={onClick}>
        <boxGeometry args={[200, 50, 5]} />
        <meshStandardMaterial color="yellow" />
        <Text
          position={[0, 0, 3]} // Adjust position to place text on the box
          fontSize={10}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {"Welcome!\nClick here for Job Recommendations."}
        </Text>
      </mesh>
    );
  };


export default Box;