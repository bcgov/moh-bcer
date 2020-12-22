import React, { useState } from 'react';
import { StyledConfirmDialog } from '@/index';
import { StyledButton } from '@/components/buttons';


export default { title: 'Mui Styled Confirm Dialog' }

export const ConfirmDialog = () => {
  const [isDeleteOpen, setOpenDelete] = useState<boolean>(false);

  return (
    <div>
      <StyledConfirmDialog 
        open={isDeleteOpen}
        maxWidth='xs'
        dialogTitle="Information will be lost"
        checkboxLabel='I understand this is a very long sentence and i want to see how the styling wraps.' 
        dialogMessage='if you check this box you agree to the agreement that you are agreeing to. Agree with the checkbox to agree.' 
        setOpen={() => setOpenDelete(false)} 
        confirmHandler={() => { console.log('delete comfirmed.'), setOpenDelete(false) }} 
      />

      <StyledButton 
        variant='contained'
        onClick={() => setOpenDelete(true)}
      >
        Test confirm
      </StyledButton>
    </div>
  )
}