const Box = ({ position, onClick }) => {
    return (
      <mesh position={position} onClick={onClick}>
        <boxGeometry args={[20, 20, 5]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    );
  };


export default Box;