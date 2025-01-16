

const Popup = ({ visible, onClose, onRowClick, rows }) => {
    if (!visible) return null;
  
    return (
      
      <div style={popupStyle}>
        <h2> Recommended Jobs :</h2>
        <h6 color='grey'>Click on the job below to know talk to HR representative! </h6>
        {rows.map((row, index) => (
          <div key={index} style={rowStyle} onClick={() => onRowClick(row)}>
            {row}
            <br/> 
            <br/> 
            <br/> 
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
    //Add color of the text to blue
    color: 'blue',
  };