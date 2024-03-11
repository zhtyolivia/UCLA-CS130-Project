import React from 'react';
import { Link } from 'react-router-dom';
import './RideshareCard.scss';
import { convertDate2Readable } from '../../utils/util'

function RideshareCard({ id, startingLocation, endingLocation, availableSeats, startTime, content }) {
  return (
    <Link to={`/driverposts/${id}`} className="post-link" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="post">
        <div className="post-details">
          <p><strong>Starting Location:</strong> {startingLocation}</p>
          <p><strong>Ending Location:</strong> {endingLocation}</p>
          <p><strong>Start time:</strong> {startTime}</p> {/* startTime is now already formatted */}
          <p><strong>Available Seats:</strong> {availableSeats}</p>
        </div>
        <p className="post-content">{content}</p>
      </div>
    </Link>
  );
}

export default RideshareCard;