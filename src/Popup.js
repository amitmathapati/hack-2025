

const Popup = ({ visible, onClose, onRowClick, rows }) => {
    if (!visible) return null;
  
    return (
      <div style={popupStyle}>
        {rows.map((row, index) => (
          <div key={index} style={rowStyle} onClick={() => onRowClick(row)}>
            {row}
          </div>
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  export default Popup;


  const popupStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  };


  const rowStyle = {
    marginBottom: '10px',
    cursor: 'pointer',
  };