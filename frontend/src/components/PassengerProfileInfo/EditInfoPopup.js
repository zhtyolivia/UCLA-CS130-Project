import './EditInfoPopup.scss'; // Importing the CSS for the Popup

const EditInfoPopup = ({ onClose, onSubmit, onChange, userData }) => {
  return (
    <div className="edit-popup-overlay">
      <div className="edit-popup-content">
        <h3>Edit your user information</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={onChange}
            placeholder="Username"
          />

          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={userData.fullName}
            onChange={onChange}
            placeholder="Full Name"
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={onChange}
            placeholder="Email"
          />

          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={onChange}
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