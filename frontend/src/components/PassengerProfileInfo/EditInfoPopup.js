import './EditInfoPopup.scss'; // Importing the CSS for the Popup

const EditInfoPopup = ({ onClose, onSubmit, onChange, profile}) => {
  
  return (
    <div className="edit-popup-overlay">
      <div className="edit-popup-content">
        <h3>Edit your user information</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={profile.name} 
            onChange={onChange}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={profile.email} 
            onChange={onChange}
          />

          <label htmlFor="phonenumber">Phone number</label>
            <input
              type="text"
              id="phonenumber"
              name="phonenumber"
              defaultValue={profile.phonenumber} 
              onChange={onChange}
          />

          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
          />

          <div className="edit-popup-actions">
            <button type="button" className="edit-popup-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="edit-popup-button">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInfoPopup;