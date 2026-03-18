import React, { useEffect } from 'react';
import { Alert, Collapse } from '@mui/material';

export default function StatusAlert({ message, severity = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <Collapse in={!!message}>
      <Alert
        severity={severity}
        onClose={onClose}
        sx={{ mb: 2 }}
        variant="filled"
      >
        {message}
      </Alert>
    </Collapse>
  );
}
