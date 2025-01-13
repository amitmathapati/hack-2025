import './DetailPopup.css';

const DetailPopup = ({ visible, onClose, text }) => {
    if (!visible) return null;
  
    return (
      // <div style={detailPopupStyle}>
      //   <div dangerouslySetInnerHTML={{ __html: text }} /> 
      //   <button onClick={onClose}>Close</button>
      // </div>
      <div className="detail-popup"> 
        <div className="detail-popup-content"> 
          <div dangerouslySetInnerHTML={{ __html: text }} /> 
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    );
  };

export default DetailPopup;



const detailPopupStyle = {
  position: 'absolute',
  top: '50%',
  left: '70%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
};


