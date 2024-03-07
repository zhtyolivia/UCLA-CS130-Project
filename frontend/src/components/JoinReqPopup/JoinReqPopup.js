// JoinReqPopup.js
import './JoinReqPopup.scss'; // Importing the CSS for the Popup

const JoinReqPopup = ({ onClose, onSubmit }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Join Request</h3>
        <form onSubmit={onSubmit}>
          <p>Are you sure you want to send a join request?</p>
          <div className="popup-actions">
            <button type="button" className="popup-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="popup-button">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinReqPopup;
