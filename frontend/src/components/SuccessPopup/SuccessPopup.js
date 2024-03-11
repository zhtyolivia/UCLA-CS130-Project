// SuccessPopup.js
import './SuccessPopup.scss'; // Importing the CSS for the Popup

export const SuccessPopup = ({ onClose, msg}) => {
  return (
    <div className="success-popup-overlay">
      <div className="success-popup-content">
        <form >
          <p>{msg}</p>
          <div className="success-popup-actions">
            <button type="button" className="success-popup-button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SuccessPopup;
