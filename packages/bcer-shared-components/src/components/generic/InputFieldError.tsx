import React from 'react';
import { FormHelperText } from '@material-ui/core';

export const InputFieldError = ({ error, ...props }: any) => {
  return (
    <FormHelperText error {...props}>{error}</FormHelperText>
  );
};


