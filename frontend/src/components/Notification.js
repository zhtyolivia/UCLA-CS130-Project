import React, { useState, useEffect } from 'react';
import { Tooltip, IconButton, Popover, Paper, Typography, List, ListItem, Divider, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getJoinRequestNotifications, getCurrentUserId } from '../services/mockAPI';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = await getCurrentUserId();
      const fetchedNotifications = await getJoinRequestNotifications(userId);
      setNotifications(fetchedNotifications);
    };
  
    fetchNotifications();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTooltipOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId, postId) => {
    handleClose(); // Close the dropdown

    // Remove the clicked notification from the list
    setNotifications(notifications.filter(notification => notification.ride.id !== notificationId));

    navigate(`/posts/${postId}`); // Navigate to the post page
  };

  return (
    <>
      <Tooltip title="Notifications" open={tooltipOpen} onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={() => setTooltipOpen(false)} disableHoverListener={Boolean(anchorEl)}>
        <IconButton onClick={handleClick} color="inherit">
          <Badge badgeContent={notifications.length} sx={{ '& .MuiBadge-badge': { backgroundColor: '#f6cd61', color: 'white' }}}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }} transformOrigin={{ vertical: 'top', horizontal: 'center', }}>
        <Paper style={{ padding: '20px', maxWidth: '300px' }}>
          {notifications.length > 0 ? (
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleNotificationClick(notification.ride.id, notification.ride.id)}>
                    <Typography variant="body1" style={{ marginLeft: '10px'}}>
                      There is a status update for your request to join "{notification.ride.title}".
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" style={{ padding: '20px', textAlign: 'center' }}>
              No new notifications
            </Typography>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default Notification;
