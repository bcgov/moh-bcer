import React from 'react';
import { Typography, styled } from '@material-ui/core';

const StyledTypography = styled(Typography)({
  
});


export const InputFieldLabel = ({ label, ...props }: any) => (
    <StyledTypography variant="body1" {...props}>
      {label}
    </StyledTypography>
);


