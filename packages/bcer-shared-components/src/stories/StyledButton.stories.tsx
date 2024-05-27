import React from 'react';

import { StyledButton } from '@/index';

export default { title: 'Mui Styled Button' }

export const Button = () => {
  return (
    <div>
      <StyledButton variant="contained">Next</StyledButton>
      <br />
      <br />
      <StyledButton variant="outlined">Edit Uploaded Information</StyledButton>
      <br />
      <br />
      <StyledButton variant="text">Cancel</StyledButton>
    </div>
  )
}