// JoinReqPopup.js
/* Part of this file was leveraged from GPT */ 
import './JoinReqPopup.scss'; // Importing the CSS for the Popup

const AcceptedPopup = ({ onClose, onSubmit, onChange, msg}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <form onSubmit={onSubmit}>
          <p>Your join request has been accepted by the driver. You can't cancel your request at this point.</p>
          <div className="popup-actions">
            <button type="button" className="highlight-popup-button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AcceptedPopup;
