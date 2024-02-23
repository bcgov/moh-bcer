import React from 'react';
import { FormHelperText } from '@mui/material';

export const InputFieldError = ({ error, ...props }: any) => {
  return (
    <FormHelperText error {...props}>{error}</FormHelperText>
  );
};


