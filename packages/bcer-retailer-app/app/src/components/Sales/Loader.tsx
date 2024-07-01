import React from 'react';
import { Snackbar } from '@mui/material';

interface IProps {
  open?: boolean;
  message?: string;
}

export default function Loader({ open = false, message = '' }: IProps) {
  return (
    <Snackbar
      open={open}
      message={message}
      ClickAwayListenerProps={{ mouseEvent: false, touchEvent: false }}
    />
  );
}
