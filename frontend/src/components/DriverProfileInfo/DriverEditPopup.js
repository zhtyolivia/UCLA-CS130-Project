import './DriverEditPopup.scss';

const DriverEditPopup = ({ onClose, profile, onSubmit, onChange }) => {

    return (
        <div className="edit-popup-overlay">
            <div className="edit-popup-content">
                <h3>Edit Driver Information</h3>
                <form onSubmit={onSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={onChange}
                    />

                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={onChange}
                    />

                    <label htmlFor="phonenumber">Phone Number</label>
                    <input
                        type="text"
                        id="phonenumber"
                        name="phonenumber"
                        value={profile.phonenumber}
                        onChange={onChange}
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
                        <button type="submit" className="edit-popup-button" >Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DriverEditPopup;
