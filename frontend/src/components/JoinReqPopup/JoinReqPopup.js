// JoinReqPopup.js
/* Part of this file was leveraged from GPT */ 
import './JoinReqPopup.scss'; // Importing the CSS for the Popup

const JoinReqPopup = ({ onClose, onSubmit, onChange, maxSeats}) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Join Request</h3>
        <form onSubmit={onSubmit}>
          <p>Are you sure you want to send a join request?</p>
          <textarea className="input-common popup-textarea"
            placeholder="Your message (required)" 
            name='message'
            id='message'
            required
            onChange={onChange}
          ></textarea>
          <input className="input-common"
            type="number"
            placeholder="Number of people you have"
            max={maxSeats}
            
            min="1"
            name='seats'
            id='seats'
            required
            onChange={onChange}
        />
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
