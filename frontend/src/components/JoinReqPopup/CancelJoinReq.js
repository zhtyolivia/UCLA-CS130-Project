// JoinReqPopup.js
/* Part of this file was leveraged from GPT */ 
import './JoinReqPopup.scss'; // Importing the CSS for the Popup

const CancelJoinReq = ({ onClose, onSubmit}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Join Request</h3>
        <form onSubmit={onSubmit}>
          <p>Are you sure you want to cancel your join request?</p>
          <div className="popup-actions">
            <button type="button" className="secondary-popup-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="secondary-popup-button">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CancelJoinReq;
