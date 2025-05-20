import React from 'react';
import { useSelector } from 'react-redux';
import { Alert, Snackbar } from '@mui/material';

const Alerts = () => {
  const alerts = useSelector((state) => state.alert);

  return (
    <>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={alert.alertType} sx={{ width: '100%' }}>
            {alert.msg}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Alerts; 