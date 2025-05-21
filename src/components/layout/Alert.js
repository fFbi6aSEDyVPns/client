import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import { removeAlert } from '../../redux/actions/alert';

const Alert = () => {
  const dispatch = useDispatch();
  const alerts = useSelector(state => state.alert);
  const [open, setOpen] = useState({});

  const handleClose = useCallback((alertId) => {
    setOpen(prev => ({ ...prev, [alertId]: false }));
    setTimeout(() => {
      dispatch(removeAlert(alertId));
    }, 300); // 等待動畫結束
  }, [dispatch]);

  useEffect(() => {
    alerts.forEach(alert => {
      if (!open[alert.id]) {
        setOpen(prev => ({ ...prev, [alert.id]: true }));
      }
    });
  }, [alerts, open]);

  return (
    <>
      {alerts.map(alert => (
        <Snackbar
          key={`alert-${alert.id}`}
          open={open[alert.id] || false}
          autoHideDuration={6000}
          onClose={() => handleClose(alert.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={alert.alertType}
            sx={{ width: '100%' }}
            onClose={() => handleClose(alert.id)}
          >
            {alert.msg}
          </MuiAlert>
        </Snackbar>
      ))}
    </>
  );
};

export default Alert; 